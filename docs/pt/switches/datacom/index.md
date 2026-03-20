# Switches Datacom — DM4270 / DM4380 / DM4770

A Datacom oferece uma linha completa de switches gerenciáveis L2/L3 para redes de provedores e corporativas, todos rodando DmOS.

## Modelos

| Modelo | Portas | Nível | Uso |
|--------|--------|-------|-----|
| DM4270 | 24x GbE + 4x SFP+ | L2/L3 | Acesso / Distribuição |
| DM4380 | 48x GbE + 4x SFP+ | L2/L3 | Distribuição |
| DM4770 | 32x SFP+ 10G | L3 Core | Núcleo / Backbone |

## Recursos Suportados

| Recurso | DM4270 | DM4380 | DM4770 |
|---------|--------|--------|--------|
| VLANs (802.1Q) | ✓ | ✓ | ✓ |
| STP/RSTP/MSTP | ✓ | ✓ | ✓ |
| Link Aggregation (LACP) | ✓ | ✓ | ✓ |
| OSPF | ✓ | ✓ | ✓ |
| BGP | — | ✓ | ✓ |
| MPLS/LDP | — | ✓ | ✓ |
| VPLS/VPWS | — | ✓ | ✓ |
| QoS (8 filas) | ✓ | ✓ | ✓ |
| ACL | ✓ | ✓ | ✓ |
| VRRP | ✓ | ✓ | ✓ |
| BFD | ✓ | ✓ | ✓ |

## Seções

- [Configuração Inicial](./configuracao-inicial) — acesso, hostname, gerência
- [VLANs e Interfaces](./vlan) — VLANs, trunk, access, SVI
- [MPLS e L2VPN](./mpls) — MPLS LDP, VPWS, VPLS
- [QoS](./qos) — policiamento, filas, marcação DSCP
- [Segurança](./seguranca) — ACL, port-security, storm-control
