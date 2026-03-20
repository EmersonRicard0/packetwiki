---
description: Configuração de MPLS/LDP e VPLS na OLT Huawei MA5800 para integração com backbone de provedor.
---

# MPLS na OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

A OLT MA5800 suporta MPLS/VPLS para integração com o backbone do provedor.

## Configuração MPLS Passo a Passo

### Passo 1 — Loopback e LSR-ID

```bash
OLT(config)# interface loopback 0
OLT(config-if-loopback0)# ip address 10.10.10.10 32
OLT(config-if-loopback0)# quit

# Definir LSR-ID (usar IP do loopback)
OLT(config)# mpls lsr-id 10.10.10.10
```

### Passo 2 — Habilitar MPLS Global e LDP

```bash
OLT(config)# mpls
OLT(config-mpls)# lsp-trigger host
OLT(config-mpls)# quit

OLT(config)# mpls ldp
OLT(config-mpls-ldp)# outbound peer all split-horizon
OLT(config-mpls-ldp)# quit
```

### Passo 3 — VLAN de Uplink com MPLS

```bash
# Criar VLAN para tráfego MPLS
OLT(config)# vlan 4001 smart
OLT(config)# port vlan 4001 0/19/0
OLT(config)# port vlan 4001 0/19/1

# Habilitar MPLS na VLAN
OLT(config)# mpls vlan 4001

# Configurar IP na VLANIF e habilitar LDP
OLT(config)# interface vlanif 4001
OLT(config-if-vlanif4001)# ip address 10.50.50.50 24
OLT(config-if-vlanif4001)# mpls
OLT(config-if-vlanif4001)# quit
```

### Passo 4 — OSPF para distribuir rotas

```bash
OLT(config)# ospf 1
OLT(config-ospf-1)# area 100
OLT(config-ospf-1-area-0.0.0.100)# network 10.50.50.50 0.0.0.255
OLT(config-ospf-1-area-0.0.0.100)# network 10.10.10.10 0.0.0.0
OLT(config-ospf-1-area-0.0.0.100)# return
```

### Passo 5 — LDP Remote Peers (para VPLS)

```bash
OLT(config)# mpls ldp remote-peer to_pe3
OLT(config-mpls-ldp-remote-to_pe3)# remote-ip 3.3.3.3
OLT(config-mpls-ldp-remote-to_pe3)# remote-ip auto-dod-request
OLT(config-mpls-ldp-remote-to_pe3)# quit

OLT(config)# mpls ldp remote-peer to_pe4
OLT(config-mpls-ldp-remote-to_pe4)# remote-ip 4.4.4.4
OLT(config-mpls-ldp-remote-to_pe4)# remote-ip auto-dod-request
OLT(config-mpls-ldp-remote-to_pe4)# quit
```

### Passo 6 — VSI (VPLS)

```bash
OLT(config)# vsi hsi
OLT(config-vsi-hsi)# pwsignal ldp
OLT(config-vsi-hsi)# vsi-id 1
OLT(config-vsi-hsi)# control-word
```

### Passo 7 — Pseudowires

```bash
OLT(config)# pw-para pwindex 1
OLT(config-pw-para-index-1)# service-type vpls
OLT(config-pw-para-index-1)# pwid 1
OLT(config-pw-para-index-1)# peer-address 3.3.3.3
OLT(config-pw-para-index-1)# pw-type ethernet tagged
OLT(config-pw-para-index-1)# control-word enable
OLT(config-pw-para-index-1)# dyn-receive-label 10240
OLT(config-pw-para-index-1)# quit

OLT(config)# pw-para pwindex 2
OLT(config-pw-para-index-1)# service-type vpls
OLT(config-pw-para-index-1)# pwid 2
OLT(config-pw-para-index-1)# peer-address 4.4.4.4
OLT(config-pw-para-index-1)# pw-type ethernet tagged
OLT(config-pw-para-index-1)# control-word enable
OLT(config-pw-para-index-1)# dyn-receive-label 10250
OLT(config-pw-para-index-1)# quit
```

## Exemplo Real — VLANIF com OSPF/MPLS no Backbone

```
interface Vlanif2542
 description "OSPF.PE01.POP.PINDORETAMA[WHG]"
 ip address 10.200.202.50 255.255.255.252
 ospf cost 300
 ospf network-type p2p
 ospf bfd enable
 ospf enable 1 area 0.0.0.0
 mpls
```

## Verificar MPLS na OLT

```bash
OLT(config)# display mpls lsp
OLT(config)# display mpls ldp session
OLT(config)# display mpls ldp peer
OLT(config)# display vsi verbose
```

---

## Veja Também

- [Interfaces e VLANs — OLT Huawei](./interface-vlan)
- [Troubleshooting / Sinal — OLT Huawei](./troubleshooting)
- [MPLS / LDP — Switch Huawei](/pt/switches/huawei/mpls)
- [MPLS L2VPN / VPLS — Switch Huawei](/pt/switches/huawei/mpls-l2vpn)
