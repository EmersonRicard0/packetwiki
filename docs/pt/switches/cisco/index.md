# Switches Cisco

A Cisco domina o mercado corporativo com uma linha completa de switches L2/L3, do acesso ao data center.

## Modelos Abrangidos

| Série | Uso | Destaques |
|-------|-----|-----------|
| Catalyst 2960 | Acesso | L2, PoE, econômico |
| Catalyst 3650 / 3850 | Distribuição | L3, stacking, VXLAN |
| Catalyst 9200 / 9300 | Acesso / Distribuição | IOS-XE, DNA Center, SD-Access |
| Nexus 9000 | Data Center | NX-OS, VXLAN, BGP EVPN |

## CLI — Acesso Inicial

```bash
# Console padrão: 9600 8N1
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-ACESSO-01
```

## Tópicos

- [Catalyst 2960](./catalyst-2960) — VLANs, STP, PoE
- [Catalyst 3650/3850](./catalyst-3650) — L3, OSPF, stacking
- [Catalyst 9200/9300](./catalyst-9200) — IOS-XE, QoS, VLAN
- [Nexus 9000](./nexus-9000) — NX-OS, VXLAN, BGP EVPN

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
