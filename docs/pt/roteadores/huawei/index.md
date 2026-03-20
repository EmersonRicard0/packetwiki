# Roteadores Huawei

Huawei possui uma linha ampla de roteadores para ISPs, data centers e redes corporativas, todos utilizando a plataforma VRP (Versatile Routing Platform).

## Modelos Principais

| Série | Segmento | Destaque |
|-------|----------|----------|
| AR100/AR200 | Corporativo pequeno | SD-WAN, MPLS |
| AR3200 | Branch enterprise | Dual WAN, firewall integrado |
| NE40E | PE/Borda de ISP | BGP full table, MPLS, BNG |
| NE8000 | Core/Backbone | Alta capacidade, 400G |
| NE9000 | Backbone ultralargo | Chassis, multi-terabit |

## Modelos BNG (Broadband Network Gateway)

| Modelo | Capacidade PPPoE |
|--------|-----------------|
| NE40E-X3 | 256K sessões |
| NE40E-X8 | 1M sessões |
| ME60-X16 | 1M sessões |

## Tópicos

- [Configuração Inicial / Regras](./configuracao-inicial) — primeiros passos, commit, candidato
- [BGP](./bgp) — eBGP, iBGP, route-policy, filtros
- [Controle de Banda](./controle-de-banda) — QoS, traffic-policy, UCL
- [SNMP](./snmp) — monitoramento
- [Backup](./backup) — salvar e exportar configuração
- [Atualização de Firmware](./update) — VRP patch, upgrade
- [Troubleshooting](./troubleshooting) — diagnóstico de falhas
- [Limpar Contadores](./limpar-contadores) — reset de estatísticas
- [BNG / PPPoE](./bng/) — configuração completa de concentrador PPPoE
