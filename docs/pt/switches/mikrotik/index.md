---
description: "Configuração de switches MikroTik CRS e CSS — VLANs, trunks, MPLS e RouterOS para provedores."
---

# Switches MikroTik

A MikroTik oferece switches gerenciáveis com excelente custo-benefício, muito utilizados em provedores de pequeno e médio porte no Brasil.

## Modelos Abrangidos

| Série | Portas | Destaques |
|-------|--------|-----------|
| CRS Series | 16~52 portas GbE / SFP+ | RouterOS + SwOS, MPLS capaz |
| CSS Series | 8~54 portas GbE / SFP+ | SwOS dedicado, foco em switching puro |

## Diferença CRS vs CSS

| Característica | CRS | CSS |
|----------------|-----|-----|
| Sistema | RouterOS ou SwOS | SwOS apenas |
| Roteamento L3 | Sim (RouterOS) | Não |
| MPLS | Sim (RouterOS) | Não |
| CLI | Winbox + SSH | Interface Web |
| Uso típico | Core / Distribuição | Acesso / Edge |

## CLI — RouterOS

```bash
# Acesso via SSH ou Winbox
/system identity set name=CRS-CORE-01
/interface bridge add name=bridge-lan
/interface vlan add interface=bridge-lan vlan-id=100 name=vlan100
```

## Tópicos

- [CRS Series](./crs) — RouterOS, VLANs, MPLS, bridging
- [CSS Series](./css) — SwOS, VLANs, trunks, mirror port

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
