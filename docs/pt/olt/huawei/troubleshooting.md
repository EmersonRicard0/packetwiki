---
description: Troubleshooting de OLT Huawei — diagnóstico de sinal óptico, ONU sem luz, falha de autenticação e porta PON.
---

# Troubleshooting — OLT Huawei

::: tip Versão testada
VRP **V800R021** (MA5800-X2 / MA5800-X7). Compatível com V800R018+.
:::

Guia de diagnóstico para as situações mais comuns em campo: ONU sem luz, sinal fraco, falha de autenticação e problemas de serviço.

---

## Diagnóstico Rápido de ONU

### ONU aparece mas não autentica

```bash
# Ver ONUs não autorizadas na porta PON
<MA5800> display ont autofind 0/1

# Ver o serial number da ONU descoberta
<MA5800> display ont autofind all

# Verificar se a ONU já está cadastrada
<MA5800> display ont info 0/1 all
```

### Ver estado de todas as ONUs de uma porta

```bash
# Estado operacional de todas as ONUs da porta PON 0/1
<MA5800> display ont info 0/1 all

# Filtrar só as que estão offline
<MA5800> display ont info 0/1 all | include offline

# Ver detalhes de uma ONU específica (porta 0/1, ont-id 5)
<MA5800> display ont info 0/1 5
```

Saída e estados:

| Estado | Significado |
|--------|------------|
| `online` | ONU operando normalmente |
| `offline` | ONU sem comunicação com a OLT |
| `dying-gasp` | ONU perdeu energia e enviou aviso |
| `power-off` | ONU desligada |

---

## Diagnóstico de Sinal Óptico

### Verificar potência óptica da ONU (RX/TX)

```bash
# Potência recebida pela OLT vinda da ONU
<MA5800> display ont optical-info 0/1 5

# Saída típica:
# Rx optical power(dBm)  : -22.50   <- sinal recebido pela OLT
# Tx optical power(dBm)  : 2.10     <- sinal enviado pela ONU
# ONU Rx power(dBm)      : -21.80   <- sinal recebido pela ONU
```

### Limites de sinal aceitáveis (GPON)

| Situação | Faixa normal | Atenção | Crítico |
|----------|-------------|---------|---------|
| ONU RX (recebido) | -8 a -27 dBm | -27 a -28 dBm | < -28 dBm |
| OLT RX (recebido da ONU) | -8 a -27 dBm | -27 a -28 dBm | < -28 dBm |

```bash
# Ver potência óptica da porta PON (OLT)
<MA5800> display interface gpon 0/1

# Ver sinal de todas as ONUs de uma porta de uma vez
<MA5800> display ont optical-info 0/1 all
```

### ONU com sinal fraco — causas comuns

```bash
# 1. Verificar histórico de quedas da ONU
<MA5800> display ont register-info 0/1 5

# 2. Ver erros de bit na porta PON
<MA5800> display port state 0/1

# 3. Ver contadores de erro da interface PON
<MA5800> display interface gpon 0/1 statistics
```

**Causas mais comuns de sinal fraco:**
- Conector sujo ou danificado — limpar com álcool isopropílico 99%
- Emenda óptica mal feita
- Raio de curvatura da fibra muito apertado
- Splitter com alta perda de inserção
- Extensão de rede além do orçamento óptico (~28 dB)

---

## ONU Offline — Diagnóstico

### Verificar causa da queda

```bash
# Ver log de eventos da ONU
<MA5800> display ont register-info 0/1 5

# Saída mostra:
# Register time    : data/hora do último registro
# Deregister cause : motivo da desconexão
```

Causas de `deregister` comuns:

| Causa | Significado |
|-------|------------|
| `dying-gasp` | ONU perdeu alimentação |
| `loss-of-signal` | Perda de sinal óptico |
| `deactivate` | ONU desativada pelo operador |
| `ranging-abort` | Falha no ranging — verificar fibra/splitter |

### Resetar ONU remotamente

```bash
# Resetar uma ONU específica
<MA5800> ont reset 0/1 5

# Aguardar ~60 segundos e verificar se voltou
<MA5800> display ont info 0/1 5
```

### Desautorizar e reautorizar ONU

```bash
# Remover e recadastrar (útil quando a ONU troca de ONT-ID)
[MA5800] interface gpon 0/1
[MA5800-gpon0/1] ont delete 5
[MA5800-gpon0/1] ont add 5 sn-auth HWTC1A2B3C4D omci ont-lineprofile-id 10 ont-srvprofile-id 10 desc "CLIENTE-REATIVADO"
[MA5800-gpon0/1] quit
```

---

## Diagnóstico de Serviço (sem internet)

### ONU online mas sem tráfego

```bash
# Verificar se o service-port está ativo
<MA5800> display service-port port 0/1 ont 5

# Ver configuração do service-port
<MA5800> display service-port 100

# Verificar VLAN do service-port
<MA5800> display service-port all | include gpon0/1
```

### Verificar GEM port

```bash
# Ver GEM ports configuradas para a ONU
<MA5800> display ont gemport 0/1 5

# Ver estatísticas de tráfego por GEM port
<MA5800> display ont gemport statistics 0/1 5
```

### Verificar perfis aplicados

```bash
# Ver line profile e service profile da ONU
<MA5800> display ont info 0/1 5 | include profile

# Ver detalhes do line profile
<MA5800> display ont-lineprofile gpon profile-id 10

# Ver detalhes do service profile
<MA5800> display ont-srvprofile gpon profile-id 10
```

---

## Diagnóstico de Porta PON

### Porta PON com muitas ONUs offline

```bash
# Ver status da porta PON
<MA5800> display interface gpon 0/1

# Ver estatísticas de erros da porta
<MA5800> display interface gpon 0/1 statistics

# Comparar potência de TX da OLT
<MA5800> display port state 0/1

# Resetar contadores para novo diagnóstico
<MA5800> reset counters interface gpon 0/1
```

### Porta PON inativa

```bash
# Ver se a porta está habilitada
[MA5800] interface gpon 0/1
[MA5800-gpon0/1] display this

# Habilitar porta PON se estiver desabilitada
[MA5800-gpon0/1] undo shutdown
```

---

## Comandos de Diagnóstico — Referência Rápida

| Objetivo | Comando |
|----------|---------|
| ONUs offline | `display ont info 0/1 all \| include offline` |
| Sinal óptico de ONU | `display ont optical-info 0/1 <id>` |
| Sinal de todas as ONUs | `display ont optical-info 0/1 all` |
| Causa de desconexão | `display ont register-info 0/1 <id>` |
| Resetar ONU | `ont reset 0/1 <id>` |
| Ver service-port | `display service-port port 0/1 ont <id>` |
| ONUs não autorizadas | `display ont autofind all` |
| Erros da porta PON | `display interface gpon 0/1 statistics` |

---

## Veja Também

- [Provisionamento de ONUs](/pt/olt/huawei/gpon-ont)
- [Serviços e Perfis DBA](/pt/olt/huawei/servicos-perfis)
- [Interfaces e VLANs](/pt/olt/huawei/interface-vlan)
- [Configuração Inicial OLT Huawei](/pt/olt/huawei/configuracao-inicial)
