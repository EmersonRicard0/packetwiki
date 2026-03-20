# Serviços de Infraestrutura

Guias de instalação e operação de serviços essenciais para infraestrutura de redes — monitoramento, VPN, autenticação e mais. Todos configurados como serviços systemd para rodar em segundo plano, iniciar automaticamente e reiniciar em caso de falha.

## Monitoramento

| Serviço | Uso | Porta padrão |
|---------|-----|-------------|
| [Zabbix](./zabbix) | Monitoramento via SNMP, agente, ICMP — ideal para ISPs | `80` (web) |
| [Grafana + Prometheus](./grafana) | Dashboards modernos com métricas em tempo real | `3000` (Grafana), `9090` (Prometheus) |

## Em breve

| Serviço | Uso |
|---------|-----|
| FreeRADIUS | Autenticação PPPoE para ISPs |
| Netdata | Monitoramento em tempo real leve |
| ntopng | Análise de tráfego de rede |

::: tip
Todos os serviços desta seção usam **systemd** — o gerenciador de serviços padrão do Linux. Os guias incluem unidade systemd completa, comandos de gerenciamento e configuração de logs.
:::
