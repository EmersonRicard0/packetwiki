---
description: "Configuração de roteadores Juniper MX e SRX — Junos OS, BGP, MPLS e firewall para ISPs."
---

# Roteadores Juniper

A Juniper Networks é amplamente usada em backbones de ISPs e redes carrier-grade, com o sistema operacional Junos conhecido pela estabilidade e flexibilidade.

## Modelos Abrangidos

| Série | Uso | Destaques |
|-------|-----|-----------|
| SRX Series | Firewall / Gateway | UTM, IPS, SD-WAN |
| MX Series | Core / Edge ISP | Trio Chipset, MPLS, full BGP table |

## CLI — Junos Básico

```bash
# Junos usa modelo hierárquico candidate/commit
> configure
# [edit]
set system host-name MX01
commit
```

## Tópicos

- [SRX Series](./srx) — Firewall, IPsec, routing
- [MX Series](./mx) — Core ISP, BGP full table, MPLS, VPLS

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
