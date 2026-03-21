---
description: Scripts prontos para profissionais de redes — backup via SSH, ping sweep, monitoramento SNMP, BGP e OLT Huawei.
---

# Scripts Úteis para Redes

Coleção de scripts comentados em português, prontos para uso em ambientes de ISP e redes corporativas.

::: tip Pré-requisitos gerais
- Bash: `openssh-client`, `snmp`, `snmp-mibs-downloader`
- Python: `pysnmp` (`pip install pysnmp`)
- MikroTik: RouterOS 6.49+ ou 7.x
:::

---

## 1. Bash — Backup automático de roteadores via SSH

Realiza backup de configuração de uma lista de roteadores via SSH, salvando com timestamp e mantendo os últimos 7 arquivos por equipamento.

```bash
#!/bin/bash
# backup-roteadores.sh
# Backup automático de configuração via SSH (Huawei / MikroTik / Linux)
# Uso: ./backup-roteadores.sh
# Agendar via cron: 0 2 * * * /opt/scripts/backup-roteadores.sh

# --- Configuração ---
BACKUP_DIR="/opt/backups/roteadores"
LOG_FILE="/var/log/backup-roteadores.log"
SSH_USER="backup"
SSH_KEY="/home/backup/.ssh/id_rsa"
RETENTION_DAYS=7   # Manter backups dos últimos 7 dias

# Lista de equipamentos: "hostname:ip:tipo"
# Tipos suportados: huawei | mikrotik
EQUIPAMENTOS=(
    "core-sp1:10.0.0.1:huawei"
    "core-sp2:10.0.0.2:huawei"
    "bng-01:10.0.0.10:huawei"
    "mk-borda:10.0.1.1:mikrotik"
)

# --- Funções ---
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

backup_huawei() {
    local hostname=$1
    local ip=$2
    local arquivo="${BACKUP_DIR}/${hostname}_$(date +%Y%m%d_%H%M%S).cfg"

    # Huawei VRP: exibe a configuração atual e salva localmente
    ssh -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=15 \
        -o BatchMode=yes \
        "${SSH_USER}@${ip}" \
        "display current-configuration" > "$arquivo" 2>/dev/null

    if [ $? -eq 0 ] && [ -s "$arquivo" ]; then
        log "OK  | $hostname ($ip) | $(wc -l < "$arquivo") linhas | $arquivo"
    else
        log "ERRO| $hostname ($ip) | Falha na conexão ou arquivo vazio"
        rm -f "$arquivo"
        return 1
    fi
}

backup_mikrotik() {
    local hostname=$1
    local ip=$2
    local arquivo="${BACKUP_DIR}/${hostname}_$(date +%Y%m%d_%H%M%S).rsc"

    # MikroTik RouterOS: exporta configuração em texto
    ssh -i "$SSH_KEY" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=15 \
        -o BatchMode=yes \
        "${SSH_USER}@${ip}" \
        "/export" > "$arquivo" 2>/dev/null

    if [ $? -eq 0 ] && [ -s "$arquivo" ]; then
        log "OK  | $hostname ($ip) | $(wc -l < "$arquivo") linhas | $arquivo"
    else
        log "ERRO| $hostname ($ip) | Falha na conexão ou arquivo vazio"
        rm -f "$arquivo"
        return 1
    fi
}

# --- Principal ---
mkdir -p "$BACKUP_DIR"
log "=== Início do ciclo de backup ==="

SUCESSO=0
FALHA=0

for equip in "${EQUIPAMENTOS[@]}"; do
    IFS=':' read -r hostname ip tipo <<< "$equip"

    case "$tipo" in
        huawei)    backup_huawei "$hostname" "$ip"   && ((SUCESSO++)) || ((FALHA++)) ;;
        mikrotik)  backup_mikrotik "$hostname" "$ip" && ((SUCESSO++)) || ((FALHA++)) ;;
        *)         log "AVISO| $hostname | Tipo desconhecido: $tipo" ;;
    esac
done

# Remover backups antigos (mais de RETENTION_DAYS dias)
find "$BACKUP_DIR" -name "*.cfg" -o -name "*.rsc" | \
    xargs ls -t 2>/dev/null | \
    awk -v keep="$((${#EQUIPAMENTOS[@]} * RETENTION_DAYS))" 'NR > keep {print}' | \
    xargs rm -f 2>/dev/null

log "=== Fim do ciclo | Sucesso: $SUCESSO | Falha: $FALHA ==="
```

---

## 2. Bash — Ping sweep de sub-rede

Varre uma sub-rede /24 enviando um ping por host e exibe quais estão respondendo, com resolução de hostname reverso.

```bash
#!/bin/bash
# ping-sweep.sh
# Uso: ./ping-sweep.sh 192.168.1
# Exemplo: ./ping-sweep.sh 10.0.0  (varre 10.0.0.1 a 10.0.0.254)

REDE=${1:-"192.168.1"}    # Prefixo /24 sem o último octeto
TIMEOUT=1                  # Segundos de timeout por ping
PARALELO=50                # Quantidade de pings simultâneos

if [[ -z "$1" ]]; then
    echo "Uso: $0 <prefixo-rede>"
    echo "Exemplo: $0 192.168.1"
    exit 1
fi

echo "Varrendo ${REDE}.1 a ${REDE}.254 ..."
echo "--------------------------------------"

# Função de ping individual (chamada em background)
verifica_host() {
    local ip="${REDE}.${1}"
    if ping -c1 -W"$TIMEOUT" "$ip" &>/dev/null; then
        # Tentar resolução reversa (PTR)
        hostname=$(dig +short -x "$ip" 2>/dev/null | sed 's/\.$//')
        if [[ -n "$hostname" ]]; then
            printf "%-18s ONLINE  %s\n" "$ip" "$hostname"
        else
            printf "%-18s ONLINE\n" "$ip"
        fi
    fi
}

export -f verifica_host
export REDE TIMEOUT

# Executa em paralelo usando xargs
seq 1 254 | xargs -P "$PARALELO" -I{} bash -c 'verifica_host "$@"' _ {}

echo "--------------------------------------"
echo "Varredura concluída."
```

---

## 3. Bash — Monitor de interfaces via SNMP (loop contínuo)

Monitora o status e o tráfego de interfaces de um equipamento via SNMP, exibindo atualizações a cada intervalo definido. Útil para acompanhar em tempo real durante um incidente.

```bash
#!/bin/bash
# monitor-interfaces-snmp.sh
# Monitora interfaces de um equipamento via SNMPv2c
# Uso: ./monitor-interfaces-snmp.sh <ip> <community> [intervalo_segundos]
# Exemplo: ./monitor-interfaces-snmp.sh 10.0.0.1 public 5

IP=${1:?"Informe o IP do equipamento"}
COMMUNITY=${2:?"Informe a community SNMP"}
INTERVALO=${3:-5}   # Segundos entre cada leitura (padrão: 5)

# OIDs padrão (IF-MIB — RFC 2863)
OID_IFNAME="1.3.6.1.2.1.31.1.1.1.1"       # ifName
OID_IFOPERSTATUS="1.3.6.1.2.1.2.2.1.8"    # ifOperStatus (1=up, 2=down)
OID_IFINOCTETS="1.3.6.1.2.1.31.1.1.1.6"   # ifHCInOctets (64-bit)
OID_IFOUTOCTETS="1.3.6.1.2.1.31.1.1.1.10" # ifHCOutOctets (64-bit)

# Verificar dependência
if ! command -v snmpwalk &>/dev/null; then
    echo "Erro: snmpwalk não encontrado. Instale com: apt install snmp"
    exit 1
fi

echo "Monitor SNMP — $IP (community: $COMMUNITY) — intervalo: ${INTERVALO}s"
echo "Pressione Ctrl+C para parar."
echo ""

# Capturar valores anteriores para calcular taxa (bps)
declare -A prev_in prev_out prev_time

while true; do
    clear
    NOW=$(date '+%Y-%m-%d %H:%M:%S')
    echo "=== $IP | $NOW ==="
    printf "%-30s %-8s %15s %15s\n" "Interface" "Status" "RX (Mbps)" "TX (Mbps)"
    echo "------------------------------------------------------------------------"

    # Ler nomes das interfaces
    while IFS= read -r line; do
        idx=$(echo "$line" | grep -oP '\.\K[0-9]+(?= =)')
        name=$(echo "$line" | grep -oP '".*"' | tr -d '"')
        [ -z "$idx" ] && continue

        # Status da interface
        status_raw=$(snmpget -v2c -c "$COMMUNITY" -Oqv "${IP}" "${OID_IFOPERSTATUS}.${idx}" 2>/dev/null)
        status="unknown"
        [[ "$status_raw" == "1" ]] && status="up"
        [[ "$status_raw" == "2" ]] && status="DOWN"

        # Octetos acumulados
        in_now=$(snmpget -v2c -c "$COMMUNITY" -Oqv "${IP}" "${OID_IFINOCTETS}.${idx}" 2>/dev/null)
        out_now=$(snmpget -v2c -c "$COMMUNITY" -Oqv "${IP}" "${OID_IFOUTOCTETS}.${idx}" 2>/dev/null)
        time_now=$(date +%s%3N)  # milissegundos

        rx_mbps="-"
        tx_mbps="-"

        # Calcular taxa se tivermos valor anterior
        if [[ -n "${prev_in[$idx]}" && -n "$in_now" && "$in_now" =~ ^[0-9]+$ ]]; then
            delta_t=$(( (time_now - prev_time[$idx]) ))
            [ "$delta_t" -gt 0 ] && {
                delta_in=$(( (in_now - prev_in[$idx]) * 8 ))
                delta_out=$(( (out_now - prev_out[$idx]) * 8 ))
                rx_mbps=$(echo "scale=2; $delta_in / $delta_t / 1000" | bc 2>/dev/null)
                tx_mbps=$(echo "scale=2; $delta_out / $delta_t / 1000" | bc 2>/dev/null)
            }
        fi

        # Salvar valores atuais para próximo ciclo
        prev_in[$idx]=$in_now
        prev_out[$idx]=$out_now
        prev_time[$idx]=$time_now

        printf "%-30s %-8s %15s %15s\n" "$name" "$status" "$rx_mbps" "$tx_mbps"

    done < <(snmpwalk -v2c -c "$COMMUNITY" -Oq "${IP}" "${OID_IFNAME}" 2>/dev/null)

    sleep "$INTERVALO"
done
```

---

## 4. Python — Verificar sessões BGP via SNMP

Consulta as sessões BGP de um roteador via SNMP (BGP4-MIB) e exibe o estado de cada peer, ASN remoto e prefixos aceitos.

```python
#!/usr/bin/env python3
# bgp-snmp-check.py
# Verifica sessões BGP via SNMPv2c (BGP4-MIB — RFC 4273)
# Uso: python3 bgp-snmp-check.py <ip> <community>
# Dependência: pip install pysnmp

import sys
from pysnmp.hlapi import (
    SnmpEngine, CommunityData, UdpTransportTarget,
    ContextData, ObjectType, ObjectIdentity,
    nextCmd, getCmd
)

# OIDs da BGP4-MIB
BGP_PEER_STATE       = "1.3.6.1.2.1.15.3.1.2"   # bgpPeerState
BGP_PEER_REMOTE_AS   = "1.3.6.1.2.1.15.3.1.9"   # bgpPeerRemoteAs
BGP_PEER_IN_PREFIXES = "1.3.6.1.2.1.15.3.1.11"  # bgpPeerInTotalMessages (aprox)
BGP_PEER_ACCEPTED    = "1.3.6.1.2.1.15.3.1.23"  # bgpPeerInUpdateElapsedTime
BGP_LOCAL_AS         = "1.3.6.1.2.1.15.2.0"     # bgpLocalAs

# Mapeamento de estado numérico para texto
ESTADOS_BGP = {
    1: "idle",
    2: "connect",
    3: "active",
    4: "opensent",
    5: "openconfirm",
    6: "established",
}

def snmp_walk(host, community, oid):
    """Retorna um dicionário {sufixo_oid: valor} para um OID base."""
    resultados = {}
    for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
        SnmpEngine(),
        CommunityData(community, mpModel=1),  # v2c
        UdpTransportTarget((host, 161), timeout=3, retries=2),
        ContextData(),
        ObjectType(ObjectIdentity(oid)),
        lexicographicMode=False
    ):
        if errorIndication or errorStatus:
            break
        for varBind in varBinds:
            oid_str = str(varBind[0])
            valor = str(varBind[1])
            # Extrair sufixo (endereço IP do peer)
            sufixo = oid_str.replace(oid + ".", "")
            resultados[sufixo] = valor
    return resultados

def snmp_get(host, community, oid):
    """Retorna o valor de um OID escalar."""
    for (errorIndication, errorStatus, _, varBinds) in getCmd(
        SnmpEngine(),
        CommunityData(community, mpModel=1),
        UdpTransportTarget((host, 161), timeout=3, retries=2),
        ContextData(),
        ObjectType(ObjectIdentity(oid)),
    ):
        if errorIndication or errorStatus:
            return None
        return str(varBinds[0][1])
    return None

def main():
    if len(sys.argv) < 3:
        print(f"Uso: {sys.argv[0]} <ip> <community>")
        sys.exit(1)

    host      = sys.argv[1]
    community = sys.argv[2]

    print(f"\n=== BGP Peers — {host} ===")

    # AS local
    local_as = snmp_get(host, community, BGP_LOCAL_AS)
    print(f"AS Local: {local_as or 'não disponível'}\n")

    # Coletar dados dos peers
    estados   = snmp_walk(host, community, BGP_PEER_STATE)
    remote_as = snmp_walk(host, community, BGP_PEER_REMOTE_AS)

    if not estados:
        print("Nenhum peer BGP encontrado (verifique community e acesso SNMP).")
        sys.exit(1)

    print(f"{'Peer IP':<18} {'AS Remoto':<12} {'Estado':<14} {'Alerta'}")
    print("-" * 65)

    estabelecidos = 0
    problemas     = 0

    for peer_ip, estado_num in sorted(estados.items()):
        estado_int = int(estado_num) if estado_num.isdigit() else 0
        estado_str = ESTADOS_BGP.get(estado_int, f"desconhecido({estado_num})")
        as_remoto  = remote_as.get(peer_ip, "?")

        # Sinalizar peers não estabelecidos
        alerta = ""
        if estado_int == 6:
            estabelecidos += 1
        else:
            alerta = "<<< ATENÇÃO"
            problemas += 1

        print(f"{peer_ip:<18} {as_remoto:<12} {estado_str:<14} {alerta}")

    print("-" * 65)
    print(f"\nResumo: {estabelecidos} established | {problemas} com problema\n")

    # Código de saída útil para monitoramento (Zabbix external check, etc.)
    sys.exit(0 if problemas == 0 else 2)

if __name__ == "__main__":
    main()
```

**Exemplo de saída:**
```
=== BGP Peers — 10.0.0.1 ===
AS Local: 65001

Peer IP            AS Remoto    Estado         Alerta
-----------------------------------------------------------------
10.0.0.2           65002        established
192.168.100.1      6762         established
203.0.113.1        1234         active         <<< ATENÇÃO
-----------------------------------------------------------------

Resumo: 2 established | 1 com problema
```

---

## 5. MikroTik RouterOS — Script de backup automático

Script nativo RouterOS que gera um backup binário e um export de texto, salva localmente e envia por e-mail (opcional).

```routeros
# mikrotik-backup.rsc
# Script de backup automático para MikroTik RouterOS
# Como usar:
#   1. Cole em System > Scripts > Name: "backup-diario"
#   2. Agende em System > Scheduler:
#      Name: backup-diario | Start Time: 02:00:00 | Interval: 1d
#      On Event: backup-diario

# --- Configuração ---
:local nomeHost [/system identity get name]
:local dataHora [/system clock get date]
:local hora     [/system clock get time]

# Formatar data para nome de arquivo (remove "/" e ":")
:local data [:pick $dataHoje 7 11]
:set dataHora ($nomeHost . "_" . \
    [:pick $dataHora 7 11] . \
    [:pick $dataHora 3 5] . \
    [:pick $dataHora 0 2])

# --- Gerar arquivos de backup ---

# 1. Backup binário (inclui senhas — protegido por senha)
/system backup save \
    name=($dataHora . "_bin") \
    password="SenhaForteAqui123"

# 2. Export de texto (sem senhas, mas legível)
/export \
    file=($dataHora . "_export") \
    hide-sensitive

:log info ("Backup gerado: " . $dataHora)

# --- Remover backups antigos (manter últimos 5) ---
:local arquivos [/file find name~"_bin.backup"]
:local total [:len $arquivos]

:if ($total > 5) do={
    :local remover ($total - 5)
    :for i from=0 to=($remover - 1) do={
        :local arquivo [:pick $arquivos $i]
        /file remove [/file find name=[/file get $arquivo name]]
        :log info "Backup antigo removido"
    }
}

# --- Enviar por e-mail (opcional — requer /tool e-mail configurado) ---
# Descomente as linhas abaixo se tiver SMTP configurado:
# /tool e-mail send \
#     to="noc@empresa.com.br" \
#     subject=("Backup RouterOS - " . $nomeHost . " - " . $dataHora) \
#     body=("Backup automático gerado com sucesso.\nEquipamento: " . $nomeHost) \
#     file=($dataHora . "_export.rsc")

:log info "Script de backup concluído com sucesso."
```

---

## 6. Bash — Verificar sinal óptico de ONUs via SNMP Huawei

Consulta o sinal óptico (RX/TX em dBm) de todas as ONUs de uma OLT Huawei MA5800 via SNMP, alertando para valores fora do padrão.

```bash
#!/bin/bash
# sinal-onus-huawei.sh
# Consulta sinal óptico de ONUs em OLT Huawei via SNMP
# Uso: ./sinal-onus-huawei.sh <ip-olt> <community>
# Dependência: apt install snmp

IP_OLT=${1:?"Informe o IP da OLT"}
COMMUNITY=${2:?"Informe a community SNMP"}

# Limiares de sinal (dBm × 100 como inteiro, conforme a MIB Huawei)
# A MIB Huawei retorna valores em unidades de 0.01 dBm (ex: -2250 = -22.50 dBm)
LIMITE_CRITICO=-2800   # < -28.00 dBm = offline iminente
LIMITE_ATENCAO=-2700   # < -27.00 dBm = sinal fraco

# OIDs Huawei GPON (hwGponDeviceMIB — compatível com MA5800 VRP V800R021+)
OID_ONT_SINAL_RX="1.3.6.1.4.1.2011.6.128.1.1.2.51.1.4"  # hwGponOntOpticalRxPower
OID_ONT_DESCRICAO="1.3.6.1.4.1.2011.6.128.1.1.2.46.1.10" # hwGponOntDescrip

if ! command -v snmpwalk &>/dev/null; then
    echo "Erro: snmpwalk não encontrado. Instale: apt install snmp"
    exit 1
fi

echo "=== Sinal Óptico ONUs — OLT $IP_OLT ==="
echo "$(date '+%Y-%m-%d %H:%M:%S')"
echo ""
printf "%-25s %-10s %-10s %-10s\n" "OID Índice" "RX (dBm)" "Status" "Alerta"
echo "------------------------------------------------------------"

CRITICO=0
ATENCAO=0
NORMAL=0

# Coletar sinais RX
while IFS= read -r linha; do
    # Extrair índice e valor
    idx=$(echo "$linha" | grep -oP '\.\K[\d.]+(?= =)')
    valor_raw=$(echo "$linha" | grep -oP '= \K-?[0-9]+')

    [ -z "$valor_raw" ] && continue

    # Converter para dBm com duas casas decimais
    dbm=$(echo "scale=2; $valor_raw / 100" | bc 2>/dev/null)

    # Classificar sinal
    alerta=""
    status=""
    if [ "$valor_raw" -lt "$LIMITE_CRITICO" ]; then
        status="CRITICO"
        alerta=">>> SINAL CRITICO"
        ((CRITICO++))
    elif [ "$valor_raw" -lt "$LIMITE_ATENCAO" ]; then
        status="ATENCAO"
        alerta="> sinal fraco"
        ((ATENCAO++))
    else
        status="ok"
        ((NORMAL++))
    fi

    printf "%-25s %-10s %-10s %s\n" "$idx" "${dbm} dBm" "$status" "$alerta"

done < <(snmpwalk -v2c -c "$COMMUNITY" -Oq "$IP_OLT" "$OID_ONT_SINAL_RX" 2>/dev/null)

echo "------------------------------------------------------------"
echo "Resumo: $NORMAL ok | $ATENCAO atenção | $CRITICO crítico"
echo ""

# Código de saída para uso com Zabbix / Nagios
[ "$CRITICO" -gt 0 ] && exit 2
[ "$ATENCAO" -gt 0 ] && exit 1
exit 0
```

::: tip Integração com Zabbix
Os scripts Python e Bash com código de saída `0/1/2` podem ser usados como **external checks** no Zabbix. Salve em `/usr/lib/zabbix/externalscripts/` e configure um item do tipo "External check" no host.
:::

---

## Veja Também

- [Monitoramento com Zabbix](/pt/linux/monitoramento/zabbix)
- [Monitoramento com Grafana](/pt/linux/monitoramento/grafana)
- [OLT Huawei — Troubleshooting](/pt/olt/huawei/troubleshooting)
- [MikroTik — BGP](/pt/roteadores/mikrotik/bgp)
