# OLT Datacom — DM4615 / DM4618

A Datacom oferece OLTs GPON de alto desempenho para provedores de internet, com suporte completo ao DmOS (Datacom Operating System).

## Modelos

| Modelo | Slots PON | Capacidade | Uso |
|--------|-----------|------------|-----|
| DM4615 | 16 portas GPON | Até 1024 ONUs | ISPs médios |
| DM4618 | 32 portas GPON | Até 2048 ONUs | ISPs grandes |

## Conceitos GPON no DmOS

| Termo | Significado |
|-------|-------------|
| OLT | Optical Line Terminal — equipamento central do provedor |
| ONU/ONT | Optical Network Unit — equipamento do cliente |
| T-CONT | Transmission Container — controla BW upstream |
| GEM Port | GPON Encapsulation Mode port |
| DBA | Dynamic Bandwidth Allocation |
| Bandwidth-Profile | Perfil de largura de banda (equivalente ao DBA-Profile Huawei) |
| Line-Profile | Configuração de T-CONTs e GEM ports |
| Service-Profile | Configuração de serviços da ONU |
| RG-Profile | Residential Gateway Profile |

## DmOS — Sistema Operacional

O DmOS é o sistema operacional da Datacom, baseado em Linux, com CLI similar ao Cisco IOS/NX-OS.

### Modos de Operação

| Modo | Prompt | Acesso |
|------|--------|--------|
| EXEC | `DM>` | Acesso inicial |
| Privilegiado | `DM#` | `enable` |
| Configuração | `DM(config)#` | `configure terminal` |
| Interface | `DM(config-if)#` | `interface <type> <id>` |
| GPON | `DM(config-gpon)#` | `gpon` |

## Seções

- [Configuração Inicial](./configuracao-inicial) — acesso, hostname, usuários
- [Perfis GPON](./gpon-perfis) — bandwidth-profile, line-profile, service-profile
- [Provisionamento de ONUs](./gpon-provisionamento) — adicionar e configurar ONUs
- [Serviços GPON](./gpon-servicos) — service-port, VLANs, upstream/downstream
- [MPLS / VPLS](./mpls-vpls) — backbone MPLS, VPWS, VPLS
