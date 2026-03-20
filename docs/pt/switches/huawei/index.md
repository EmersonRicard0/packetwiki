# Switches Huawei

Huawei oferece uma linha completa de switches para redes corporativas e de provedores, com CLI baseada no VRP (Versatile Routing Platform).

## Modelos Principais

| Série | Uso | Destaque |
|-------|-----|----------|
| S1700 | Acesso | Não gerenciável |
| S2700 | Acesso | Gerenciável básico |
| S5700 | Distribuição | L2/L3 completo |
| S6700 | Núcleo | 10GE, empilhável |
| CloudEngine 6800 | Data Center / Core ISP | 40/100GE, MPLS |
| CloudEngine 12800 | Backbone ISP | Chassis, alta densidade |

## Acesso Inicial

```bash
# Console padrão: 9600 8N1
# Usuário padrão (fábrica): admin / Admin@huawei
enable
system-view
```

## Tópicos

- [Configuração Inicial](./configuracao-inicial) — hostname, usuário, console, senha
- [Gerência e SSH](./gerencia-ssh) — interface de gerência, SSH, ACL de acesso
- [VLAN e Interfaces](./vlan) — criação de VLANs, trunk, access
- [Agregação de Links](./agregacao) — LACP, Eth-Trunk
- [Controle de Banda](./controle-de-banda) — QoS, traffic-policy, CAR
- [SNMP](./snmp) — monitoramento via SNMP v2c/v3
- [Log / Syslog](./log-syslog) — envio de logs para servidor externo
- [Backup e Restore](./backup-restore) — salvar e restaurar configuração
- [Data e Hora / NTP](./time-date) — NTP, timezone
- [MPLS / LDP](./mpls) — MPLS backbone, LDP, OSPF
- [MPLS L2VPN](./mpls-l2vpn) — VSI, VPLS, Pseudowire
- [Troubleshooting](./troubleshooting) — diagnóstico de falhas
