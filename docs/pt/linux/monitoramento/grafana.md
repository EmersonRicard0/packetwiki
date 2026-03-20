---
description: Instalação do Grafana com Prometheus no Ubuntu para dashboards de rede e servidores Linux.
---

# Grafana + Prometheus — Dashboards de Monitoramento

::: tip Versão testada
**Grafana OSS 10.x** + **Prometheus 2.x** no Ubuntu Server 22.04 LTS.
:::

Grafana + Prometheus é a stack de observabilidade mais moderna para infraestrutura. Prometheus coleta métricas; Grafana visualiza com dashboards.

---

## Instalação do Prometheus

```bash
# Criar usuário de sistema
useradd --no-create-home --shell /bin/false prometheus

# Baixar e instalar
cd /tmp
wget https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
tar xvf prometheus-2.47.0.linux-amd64.tar.gz

cp prometheus-2.47.0.linux-amd64/prometheus /usr/local/bin/
cp prometheus-2.47.0.linux-amd64/promtool   /usr/local/bin/

mkdir -p /etc/prometheus /var/lib/prometheus
cp -r prometheus-2.47.0.linux-amd64/consoles          /etc/prometheus/
cp -r prometheus-2.47.0.linux-amd64/console_libraries /etc/prometheus/

chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
```

### Configurar Prometheus

```yaml
# /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets:
          - '192.168.1.10:9100'   # servidor-01
          - '192.168.1.11:9100'   # servidor-02
```

### Criar serviço systemd

```bash
cat > /etc/systemd/system/prometheus.service << 'EOF'
[Unit]
Description=Prometheus
After=network.target

[Service]
User=prometheus
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --storage.tsdb.retention.time=30d \
  --web.listen-address=0.0.0.0:9090
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now prometheus
```

---

## Node Exporter (métricas de servidores Linux)

```bash
# Instalar em cada servidor monitorado
cd /tmp
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvf node_exporter-1.6.1.linux-amd64.tar.gz
cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

useradd --no-create-home --shell /bin/false node_exporter

cat > /etc/systemd/system/node_exporter.service << 'EOF'
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now node_exporter
```

---

## SNMP Exporter (métricas de equipamentos de rede)

```bash
# Instalar snmp_exporter para monitorar roteadores/switches via SNMP
apt install -y snmp-exporter   # ou baixar binário do GitHub

# Coletar métricas de equipamentos Huawei, MikroTik, Cisco
# Adicionar no prometheus.yml:
```

```yaml
  - job_name: 'snmp'
    static_configs:
      - targets:
          - 192.168.1.1   # roteador
          - 192.168.1.2   # switch
    metrics_path: /snmp
    params:
      module: [if_mib]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9116   # endereço do snmp_exporter
```

---

## Instalação do Grafana

```bash
apt install -y apt-transport-https software-properties-common

wget -q -O /usr/share/keyrings/grafana.key https://apt.grafana.com/gpg.key

echo "deb [signed-by=/usr/share/keyrings/grafana.key] https://apt.grafana.com stable main" \
  | tee /etc/apt/sources.list.d/grafana.list

apt update && apt install -y grafana

systemctl enable --now grafana-server
```

Acessar: `http://IP_DO_SERVIDOR:3000`
- Usuário: `admin`
- Senha: `admin` (trocar no primeiro acesso)

### Adicionar Prometheus como Data Source

1. **Configuration → Data Sources → Add data source**
2. Selecionar **Prometheus**
3. URL: `http://localhost:9090`
4. Clicar em **Save & Test**

### Importar dashboards prontos

| Dashboard ID | Descrição |
|-------------|-----------|
| `1860` | Node Exporter Full (CPU, RAM, disco, rede) |
| `9821` | MikroTik — RouterOS SNMP |
| `12356` | SNMP Interface Traffic |
| `13659` | Huawei SNMP |

Em **Dashboards → Import**, inserir o ID e selecionar o data source Prometheus.

---

## Alertas no Grafana

```yaml
# Exemplo de alerta para CPU > 90% por 5 minutos
# Em Alerting → Alert rules → New alert rule
# Condição:
# avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) by (instance) > 0.9
```

---

## Problemas Comuns

```bash
# Prometheus não coleta de um target
# Verificar em http://localhost:9090/targets

# Testar manualmente
curl http://192.168.1.10:9100/metrics | head -30

# Ver log do Prometheus
journalctl -u prometheus -f

# Ver log do Grafana
journalctl -u grafana-server -f
```

---

## Veja Também

- [Zabbix](/pt/linux/monitoramento/zabbix)
- [SNMP — Roteador Huawei](/pt/roteadores/huawei/snmp)
- [SNMP — Switch Huawei](/pt/switches/huawei/snmp)
