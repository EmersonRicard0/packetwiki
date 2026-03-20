---
description: "Configuração de OLTs Huawei e Datacom — GPON, provisionamento de ONUs, DBA e MPLS para ISPs."
---

# OLT — Optical Line Terminal

OLT é o equipamento central em redes GPON/XGS-PON, responsável por gerenciar dezenas ou centenas de ONUs (Optical Network Units) conectadas via fibra óptica.

## Fabricantes

| Fabricante | Modelos | Destaque |
|-----------|---------|----------|
| Huawei | MA5800-X2/X7/X15/X17 | Mercado dominante no Brasil |
| ZTE | C600, C650 | Alternativa popular |
| Nokia | 7360 ISAM FX | Operadoras grandes |
| Fiberhome | AN5516 | ISPs regionais |

## Conceitos GPON

| Termo | Significado |
|-------|-------------|
| OLT | Optical Line Terminal — equipamento central do provedor |
| ONU/ONT | Optical Network Unit — equipamento do cliente |
| PON | Passive Optical Network |
| T-CONT | Transmission Container — controla BW upstream |
| GEM Port | GPON Encapsulation Mode port |
| DBA | Dynamic Bandwidth Allocation |
| Line-Profile | Configuração de T-CONTs e GEM ports |
| Srv-Profile | Configuração de portas da ONU |
| Service-Port | Associação ONU ↔ VLAN de serviço |

## Seções

- [Huawei MA5800](./huawei/) — configuração completa da OLT Huawei
- [Datacom DM4615/DM4618](./datacom/) — OLT Datacom com DmOS
