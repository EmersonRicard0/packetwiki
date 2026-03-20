---
description: "Guias para switches HP Aruba 2530, 2930 e CX 6200 — VLANs, OSPF, AOS-CX e gerenciamento."
---

# Switches HP / Aruba

A Aruba Networks (HPE) oferece switches gerenciáveis para ambientes corporativos, com forte integração ao ecossistema Aruba Central (cloud management).

## Modelos Abrangidos

| Modelo | Portas | Nível | Destaques |
|--------|--------|-------|-----------|
| Aruba 2530 | 24/48x GbE | L2 | PoE, gerenciável básico |
| Aruba 2930 | 24/48x GbE | L3 | Routing básico, stacking |
| Aruba CX 6200 | 48x GbE + 4x SFP+ | L3 | AOS-CX, cloud-ready |

## CLI — AOS-CX (CX Series)

```bash
# AOS-CX — sintaxe similar ao Linux
switch# configure terminal
switch(config)# hostname ARUBA-CX-01
switch(config)# end
switch# write memory
```

## Tópicos

- [Aruba 2530](./2530) — VLANs, STP, PoE
- [Aruba 2930](./2930) — L3, OSPF, stacking
- [Aruba CX 6200](./cx-6200) — AOS-CX, VRF, BGP

::: info Em construção
Os guias detalhados desta seção estão sendo desenvolvidos. Quer contribuir? Veja o [guia de contribuição](/pt/contribuir).
:::
