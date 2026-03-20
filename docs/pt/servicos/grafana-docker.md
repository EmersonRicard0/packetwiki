---
description: Instalação do Grafana + Prometheus via Docker Compose — stack completa de observabilidade em minutos.
---

# Grafana + Prometheus — Instalação via Docker

::: tip Versão testada
**Grafana OSS 10.x** + **Prometheus 2.x** com Docker Compose v2 no Ubuntu 22.04 LTS.
:::

Stack completa de observabilidade em um único `docker-compose.yml` — Prometheus coletando métricas, Node Exporter nos servidores, e Grafana para dashboards.

---

## 1. Instalar Docker

```bash
curl -fsSL https://get.docker.com | bash
docker --version && docker compose version
```

---

## 2. Criar Estrutura

```bash
mkdir -p /opt/monitoring/{prometheus,grafana}
cd /opt/monitoring
```

---

## 3. Configuração do Prometheus

```bash
nano /opt/monitoring/prometheus/prometheus.yml
```

```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'servidores'
    static_configs:
      - targets:
          - '192.168.1.10:9100'   # servidor-01
          - '192.168.1.11:9100'   # servidor-02
        labels:
          env: 'producao'

  - job_name: 'snmp-equipamentos'
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
        replacement: snmp-exporter:9116
```

---

## 4. Criar o `docker-compose.yml`

```bash
nano /opt/monitoring/docker-compose.yml
```

```yaml
version: '3.8'

services:

  # ── Prometheus ────────────────────────────────────
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--storage.tsdb.retention.size=10GB'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  # ── Grafana ───────────────────────────────────────
  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    restart: unless-stopped
    depends_on:
      - prometheus
    environment:
      GF_SECURITY_ADMIN_USER:     admin
      GF_SECURITY_ADMIN_PASSWORD: SenhaGrafana@2024
      GF_USERS_ALLOW_SIGN_UP:     "false"
      GF_SERVER_DOMAIN:           IP_OU_DOMINIO
      TZ:                         America/Sao_Paulo
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    networks:
      - monitoring

  # ── Node Exporter (métricas do host Docker) ───────
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    pid: host
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    ports:
      - "9100:9100"
    networks:
      - monitoring

  # ── SNMP Exporter (equipamentos de rede) ──────────
  snmp-exporter:
    image: prom/snmp-exporter:latest
    container_name: snmp-exporter
    restart: unless-stopped
    ports:
      - "9116:9116"
    networks:
      - monitoring

volumes:
  prometheus-data:
  grafana-data:

networks:
  monitoring:
    driver: bridge
```

---

## 5. Iniciar a Stack

```bash
cd /opt/monitoring
docker compose up -d

# Acompanhar logs
docker compose logs -f
```

Acessos:
- **Grafana:** `http://IP_DO_SERVIDOR:3000` → admin / SenhaGrafana@2024
- **Prometheus:** `http://IP_DO_SERVIDOR:9090`

---

## 6. Conectar Grafana ao Prometheus

1. **Configuration → Data Sources → Add data source**
2. Selecione **Prometheus**
3. URL: `http://prometheus:9090` *(nome do container — funciona dentro da rede Docker)*
4. **Save & Test** → ✅

---

## 7. Importar Dashboards

Em **Dashboards → Import**:

| ID | Dashboard |
|----|-----------|
| `1860` | Node Exporter Full |
| `9821` | MikroTik RouterOS SNMP |
| `12356` | SNMP Interface Traffic |
| `13659` | Huawei SNMP |

---

## 8. Gerenciar a Stack

```bash
cd /opt/monitoring

# Status dos containers
docker compose ps

# Logs em tempo real
docker compose logs -f

# Log de um serviço específico
docker compose logs -f grafana
docker compose logs -f prometheus

# Reiniciar serviço específico
docker compose restart prometheus
docker compose restart grafana

# Parar tudo
docker compose down

# Hot-reload do Prometheus (sem reiniciar)
curl -X POST http://localhost:9090/-/reload
```

---

## 9. Instalar Node Exporter nos Servidores Monitorados

Nos servidores Linux que você quer monitorar (fora do Docker):

```bash
useradd --system --no-create-home --shell /bin/false node_exporter

cd /tmp
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvf node_exporter-1.6.1.linux-amd64.tar.gz
cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

cat > /etc/systemd/system/node_exporter.service << 'EOF'
[Unit]
Description=Node Exporter
After=network-online.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now node_exporter
```

Após instalar, adicione o IP ao `prometheus.yml` e faça o hot-reload:

```bash
# Editar prometheus.yml e adicionar o novo target
nano /opt/monitoring/prometheus/prometheus.yml

# Recarregar sem derrubar
curl -X POST http://localhost:9090/-/reload
```

---

## 10. Atualizar a Stack

```bash
cd /opt/monitoring
docker compose pull
docker compose up -d
```

---

## Referência Rápida

| Ação | Comando |
|------|---------|
| Iniciar | `docker compose up -d` |
| Status | `docker compose ps` |
| Logs | `docker compose logs -f` |
| Hot-reload Prometheus | `curl -X POST http://localhost:9090/-/reload` |
| Reiniciar Grafana | `docker compose restart grafana` |
| Parar | `docker compose down` |
| Atualizar | `docker compose pull && docker compose up -d` |

---

## Veja Também

- [Grafana + Prometheus — Instalação nativa](/pt/servicos/grafana)
- [Zabbix via Docker](/pt/servicos/zabbix-docker)
- [SNMP — Roteador Huawei](/pt/roteadores/huawei/snmp)
