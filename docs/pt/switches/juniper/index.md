# Switches Juniper

A Juniper oferece switches de alto desempenho para data centers e redes corporativas, rodando Junos OS com suporte completo a EVPN-VXLAN e automação.

## Modelos Abrangidos

| Série | Uso | Destaques |
|-------|-----|-----------|
| EX Series | Campus / Distribuição | Junos, Virtual Chassis, PoE |
| QFX Series | Data Center / Core | EVPN-VXLAN, BGP EVPN, 10/25/100GE |

## CLI — Junos

```bash
# Junos — modelo candidate/commit
> configure
# [edit]
set system host-name QFX-CORE-01
set interfaces xe-0/0/0 unit 0 family ethernet-switching
commit
```

## Tópicos

- [EX Series](./ex) — VLANs, STP, RSTP, Virtual Chassis
- [QFX Series](./qfx) — EVPN, VXLAN, BGP data center fabric

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
