---
description: Guia completo de instalação do Grafana e Prometheus como serviços systemd no Ubuntu 22.04 — dashboards de rede e servidores.
---

# Grafana + Prometheus — Instalação como Serviço

::: tip Versão testada
**Grafana OSS 10.x** + **Prometheus 2.47** no **Ubuntu Server 22.04 LTS**.
:::

Stack composta por três serviços independentes:

| Serviço | Unidade systemd | Porta | Função |
|---------|----------------|-------|--------|
| Prometheus | `prometheus` | `9090` | Coleta e armazena métricas (time series) |
| Node Exporter | `node_exporter` | `9100` | Exporta métricas do servidor Linux |
| Grafana | `grafana-server` | `3000` | Dashboards e visualização |

---

## 1. Instalar o Prometheus

### Criar usuário de sistema

```bash
useradd --system --no-create-home --shell /bin/false prometheus
```

### Baixar e instalar binários

```bash
cd /tmp
PROM_VERSION="2.47.0"
wget https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz
tar xvf prometheus-${PROM_VERSION}.linux-amd64.tar.gz

# Instalar binários
cp prometheus-${PROM_VERSION}.linux-amd64/prometheus  /usr/local/bin/
cp prometheus-${PROM_VERSION}.linux-amd64/promtool    /usr/local/bin/

# Criar diretórios
mkdir -p /etc/prometheus /var/lib/prometheus
cp -r prometheus-${PROM_VERSION}.linux-amd64/consoles           /etc/prometheus/
cp -r prometheus-${PROM_VERSION}.linux-amd64/console_libraries  /etc/prometheus/

# Ajustar permissões
chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
```

### Configurar Prometheus

```bash
cat > /etc/prometheus/prometheus.yml << 'EOF'
global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:

  # O próprio Prometheus
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Servidores Linux com Node Exporter
  - job_name: 'servidores'
    static_configs:
      - targets:
          - '192.168.1.10:9100'   # servidor-01
          - '192.168.1.11:9100'   # servidor-02
        labels:
          env: 'producao'

  # Equipamentos de rede via SNMP Exporter
  - job_name: 'snmp'
    static_configs:
      - targets:
          - '192.168.1.1'    # roteador-core
          - '192.168.1.2'    # switch-distribuicao
    metrics_path: /snmp
    params:
      module: [if_mib]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9116
EOF

chown prometheus:prometheus /etc/prometheus/prometheus.yml
```

### Criar unidade systemd do Prometheus

```bash
cat > /etc/systemd/system/prometheus.service << 'EOF'
[Unit]
Description=Prometheus Monitoring
Documentation=https://prometheus.io/docs/
After=network-online.target
Wants=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
RestartSec=5s

ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --storage.tsdb.retention.time=30d \
  --storage.tsdb.retention.size=10GB \
  --web.listen-address=0.0.0.0:9090 \
  --web.enable-lifecycle

[Install]
WantedBy=multi-user.target
EOF
```

```bash
systemctl daemon-reload
systemctl enable --now prometheus
systemctl status prometheus
```

---

## 2. Instalar o Node Exporter

Node Exporter coleta métricas do servidor Linux (CPU, RAM, disco, rede) e as expõe para o Prometheus.

### Instalar em cada servidor monitorado

```bash
useradd --system --no-create-home --shell /bin/false node_exporter

cd /tmp
NE_VERSION="1.6.1"
wget https://github.com/prometheus/node_exporter/releases/download/v${NE_VERSION}/node_exporter-${NE_VERSION}.linux-amd64.tar.gz
tar xvf node_exporter-${NE_VERSION}.linux-amd64.tar.gz
cp node_exporter-${NE_VERSION}.linux-amd64/node_exporter /usr/local/bin/
chown node_exporter:node_exporter /usr/local/bin/node_exporter
```

### Criar unidade systemd do Node Exporter

```bash
cat > /etc/systemd/system/node_exporter.service << 'EOF'
[Unit]
Description=Prometheus Node Exporter
Documentation=https://github.com/prometheus/node_exporter
After=network-online.target
Wants=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
Restart=on-failure
RestartSec=5s

ExecStart=/usr/local/bin/node_exporter \
  --collector.systemd \
  --collector.processes

[Install]
WantedBy=multi-user.target
EOF
```

```bash
systemctl daemon-reload
systemctl enable --now node_exporter
systemctl status node_exporter
```

Testar: `curl http://localhost:9100/metrics | head -20`

---

## 3. Instalar o Grafana

```bash
# Adicionar repositório oficial
apt install -y apt-transport-https software-properties-common

wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key

echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" \
  | tee /etc/apt/sources.list.d/grafana.list

apt update && apt install -y grafana
```

### Configurar o serviço Grafana

```bash
# Arquivo de configuração principal
nano /etc/grafana/grafana.ini
```

Parâmetros recomendados:

```ini
[server]
http_addr = 0.0.0.0
http_port = 3000
domain    = IP_OU_DOMINIO_DO_SERVIDOR

[security]
admin_user     = admin
admin_password = SenhaGrafana@2024   # troque após o primeiro acesso
secret_key     = chave-aleatoria-longa-aqui

[users]
allow_sign_up = false

[smtp]
enabled  = true
host     = smtp.gmail.com:587
user     = seu-email@gmail.com
password = app-password-do-gmail
from_address = seu-email@gmail.com
from_name    = PacketWiki Grafana
```

### Habilitar e iniciar o serviço

```bash
systemctl daemon-reload
systemctl enable --now grafana-server
systemctl status grafana-server
```

Acessar: `http://IP_DO_SERVIDOR:3000`

```
Usuário: admin
Senha:   SenhaGrafana@2024
```

---

## 4. Conectar Grafana ao Prometheus

1. Acesse **Configuration → Data Sources → Add data source**
2. Selecione **Prometheus**
3. Configure:
   - **URL:** `http://localhost:9090`
   - **Scrape interval:** `15s`
4. Clique em **Save & Test** — deve aparecer ✅

---

## 5. Importar Dashboards Prontos

Em **Dashboards → Import**, use os IDs abaixo:

| ID | Dashboard | Descrição |
|----|-----------|-----------|
| `1860` | Node Exporter Full | CPU, RAM, disco, rede de servidores Linux |
| `9821` | MikroTik RouterOS SNMP | Interfaces, CPU, memória do MikroTik |
| `12356` | SNMP Interface Traffic | Tráfego de interfaces via SNMP |
| `13659` | Huawei SNMP Dashboard | Switches e roteadores Huawei |
| `3662` | Prometheus Stats | Métricas do próprio Prometheus |

---

## 6. Gerenciamento dos Serviços

### Comandos systemd

```bash
# Ver status de todos os serviços da stack
systemctl status prometheus node_exporter grafana-server

# Reiniciar após alterar configurações
systemctl restart prometheus
systemctl restart grafana-server

# Recarregar config do Prometheus sem derrubar (hot-reload)
curl -X POST http://localhost:9090/-/reload

# Ver se estão habilitados no boot
systemctl is-enabled prometheus node_exporter grafana-server
```

### Parar e desabilitar temporariamente

```bash
systemctl stop grafana-server
systemctl disable grafana-server

# Reativar
systemctl enable --now grafana-server
```

---

## 7. Gerenciamento de Logs

```bash
# Prometheus — log em tempo real
journalctl -u prometheus -f

# Node Exporter — log em tempo real
journalctl -u node_exporter -f

# Grafana — log em tempo real
journalctl -u grafana-server -f

# Filtrar apenas erros de qualquer um dos serviços
journalctl -u prometheus -u grafana-server -p err -n 50

# Log do Grafana no arquivo
tail -f /var/log/grafana/grafana.log
```

---

## 8. Firewall

```bash
# Grafana (interface web)
ufw allow 3000/tcp

# Prometheus (opcional — só liberar se for acessar de fora)
ufw allow 9090/tcp

# Node Exporter (opcional — Prometheus acessa internamente)
# ufw allow 9100/tcp
```

---

## Referência Rápida

| Ação | Comando |
|------|---------|
| Status de todos | `systemctl status prometheus node_exporter grafana-server` |
| Reiniciar Prometheus | `systemctl restart prometheus` |
| Reiniciar Grafana | `systemctl restart grafana-server` |
| Hot-reload Prometheus | `curl -X POST http://localhost:9090/-/reload` |
| Log Prometheus | `journalctl -u prometheus -f` |
| Log Grafana | `journalctl -u grafana-server -f` |
| Testar Node Exporter | `curl http://localhost:9100/metrics \| head` |
| Ver targets Prometheus | `curl http://localhost:9090/api/v1/targets` |

---

## Problemas Comuns

### Prometheus — target com status "down"

```bash
# Ver status dos targets no endpoint de API
curl http://localhost:9090/api/v1/targets | python3 -m json.tool | grep -A5 "health"

# Testar manualmente se o Node Exporter responde
curl http://192.168.1.10:9100/metrics | head -5

# Verificar firewall no servidor alvo
ssh 192.168.1.10 "ufw status; ss -tlnp | grep 9100"
```

### Grafana não conecta no Prometheus

```bash
# Verificar se o Prometheus está respondendo
curl http://localhost:9090/-/healthy

# Verificar configuração do data source no Grafana
journalctl -u grafana-server -n 30 | grep -i "prometheus"
```

### Serviço não inicia após reboot

```bash
# Verificar se está habilitado
systemctl is-enabled prometheus grafana-server node_exporter

# Verificar se há erro na unidade
systemctl status prometheus --no-pager -l
```

---

## Veja Também

- [Zabbix — Instalação como Serviço](/pt/servicos/zabbix)
- [SNMP — Roteador Huawei](/pt/roteadores/huawei/snmp)
- [SNMP — Switch Huawei](/pt/switches/huawei/snmp)
