# MPLS e L2VPN — Switch Datacom

::: tip Versão testada
DmOS **21.1** (DM4380 / DM4770). Compatível com DmOS 19.x+.
:::

Os switches DM4380 e DM4770 suportam MPLS completo com LDP, VPWS e VPLS para backbone de provedores.

## Configuração MPLS

### Passo 1 — Loopback e LSR-ID

```bash
DM(config)# interface loopback 0
DM(config-if-lo0)# ip address 10.1.1.1 255.255.255.255
DM(config-if-lo0)# no shutdown
DM(config-if-lo0)# exit

DM(config)# mpls lsr-id 10.1.1.1
```

### Passo 2 — MPLS Global e LDP

```bash
DM(config)# mpls ip
DM(config)# mpls ldp
```

### Passo 3 — OSPF com MPLS

```bash
DM(config)# router ospf 1
DM(config-router-ospf-1)# router-id 10.1.1.1
DM(config-router-ospf-1)# network 10.1.1.1 0.0.0.0 area 0
DM(config-router-ospf-1)# network 10.100.0.0 0.0.255.255 area 0
DM(config-router-ospf-1)# exit
```

### Passo 4 — Habilitar MPLS nas Interfaces de Core

```bash
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# ip address 10.100.0.1 255.255.255.252
DM(config-if-eth0/24)# mpls ip
DM(config-if-eth0/24)# mpls ldp
DM(config-if-eth0/24)# ospf network point-to-point
DM(config-if-eth0/24)# ospf enable 1 area 0
DM(config-if-eth0/24)# no shutdown
DM(config-if-eth0/24)# exit
```

## BFD para OSPF

```bash
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# ospf bfd enable
DM(config-if-eth0/24)# exit

DM(config)# bfd
DM(config-bfd)# default-detect-multiplier 3
DM(config-bfd)# default-min-echo-rx-interval 300
DM(config-bfd)# exit
```

## VPWS (Ponto-a-Ponto L2)

```bash
# LDP remoto (targeted LDP)
DM(config)# mpls ldp
DM(config-mpls-ldp)# neighbor 10.2.2.2 targeted
DM(config-mpls-ldp)# exit

# Criar VPWS
DM(config)# l2vpn
DM(config-l2vpn)# vpws instance 10 name "LINK-CLIENTE-A"
DM(config-l2vpn-vpws-10)# peer 10.2.2.2 pw-id 100
DM(config-l2vpn-vpws-10)# interface ethernet 0/1
DM(config-l2vpn-vpws-10)# vlan 100
DM(config-l2vpn-vpws-10)# exit
```

## VPLS (Multiponto L2)

### Criar VSI

```bash
DM(config)# l2vpn
DM(config-l2vpn)# vpls instance 1 name "BACKBONE-HSI"
DM(config-l2vpn-vpls-1)# signaling ldp
DM(config-l2vpn-vpls-1)# vsi-id 1
DM(config-l2vpn-vpls-1)# control-word enable
DM(config-l2vpn-vpls-1)# exit
```

### Adicionar Peers

```bash
DM(config-l2vpn)# vpls instance 1
DM(config-l2vpn-vpls-1)# peer 10.2.2.2 pw-id 1
DM(config-l2vpn-vpls-1)# peer 10.3.3.3 pw-id 2
DM(config-l2vpn-vpls-1)# exit
```

### Associar Interface ao VPLS

```bash
DM(config)# interface ethernet 0/2
DM(config-if-eth0/2)# l2vpn vpls instance 1
DM(config-if-eth0/2)# exit
```

## VRRP (Redundância de Gateway)

```bash
DM(config)# interface vlan 10
DM(config-if-vlan10)# ip address 10.10.10.2 255.255.255.0
DM(config-if-vlan10)# vrrp 1 ip 10.10.10.1
DM(config-if-vlan10)# vrrp 1 priority 110       # maior prioridade = master
DM(config-if-vlan10)# vrrp 1 preempt
DM(config-if-vlan10)# vrrp 1 timers advertise 1
DM(config-if-vlan10)# exit
```

## Verificar MPLS / L2VPN

```bash
DM# show mpls ldp session
DM# show mpls ldp peer
DM# show mpls forwarding-table
DM# show l2vpn vpls
DM# show l2vpn vpls instance 1
DM# show l2vpn vpws instance 10
DM# show vrrp
DM# show vrrp brief
```
