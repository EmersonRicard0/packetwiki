# MPLS / VPLS — OLT Datacom

::: tip Versão testada
DmOS **21.1** (DM4615 / DM4618). Compatível com DmOS 19.x+.
:::

A OLT Datacom DM4615/DM4618 suporta MPLS com LDP e RSVP, além de serviços L2VPN (VPWS e VPLS) para integração com o backbone do provedor.

## Configuração MPLS

### Passo 1 — Loopback e Router-ID

```bash
DM(config)# interface loopback 0
DM(config-if-lo0)# ip address 10.10.10.10 255.255.255.255
DM(config-if-lo0)# no shutdown
DM(config-if-lo0)# exit

# Definir MPLS LSR-ID
DM(config)# mpls lsr-id 10.10.10.10
```

### Passo 2 — Habilitar MPLS Global

```bash
DM(config)# mpls ip
DM(config)# mpls ldp
```

### Passo 3 — Habilitar MPLS nas Interfaces de Uplink

```bash
DM(config)# interface ethernet 0/0
DM(config-if-eth0/0)# mpls ip
DM(config-if-eth0/0)# mpls ldp
DM(config-if-eth0/0)# exit
```

### Passo 4 — OSPF para Distribuição de Rotas

```bash
DM(config)# router ospf 1
DM(config-router-ospf-1)# router-id 10.10.10.10
DM(config-router-ospf-1)# network 10.10.10.10 0.0.0.0 area 0
DM(config-router-ospf-1)# network 10.200.0.0 0.0.255.255 area 0
DM(config-router-ospf-1)# exit
```

### Verificar MPLS

```bash
DM# show mpls ldp session
DM# show mpls ldp peer
DM# show mpls forwarding-table
DM# show mpls ldp binding
```

## LDP Remote Peers

Para VPLS, é necessário configurar sessões LDP remotas (targeted LDP):

```bash
DM(config)# mpls ldp
DM(config-mpls-ldp)# neighbor 3.3.3.3 targeted
DM(config-mpls-ldp)# neighbor 4.4.4.4 targeted
DM(config-mpls-ldp)# exit
```

## VPWS (Virtual Private Wire Service)

VPWS cria um circuito ponto-a-ponto entre dois PEs:

```bash
# Criar VPWS instance
DM(config)# l2vpn
DM(config-l2vpn)# vpws instance 10 name "CLIENTE-A-P2P"
DM(config-l2vpn-vpws-10)# pw-class 1
DM(config-l2vpn-vpws-10)# peer 3.3.3.3 pw-id 100
DM(config-l2vpn-vpws-10)# interface gpon 0/1 onu-id 1 gem-port 1 vlan 100
DM(config-l2vpn-vpws-10)# exit
```

## VPLS (Virtual Private LAN Service)

VPLS cria uma LAN virtual multiponto (L2 multipoint):

### Criar VSI (Virtual Switching Instance)

```bash
DM(config)# l2vpn
DM(config-l2vpn)# vpls instance 1 name "HSI-BACKBONE"
DM(config-l2vpn-vpls-1)# signaling ldp
DM(config-l2vpn-vpls-1)# vsi-id 1
DM(config-l2vpn-vpls-1)# control-word enable
DM(config-l2vpn-vpls-1)# exit
```

### Adicionar Pseudowires ao VSI

```bash
DM(config-l2vpn)# vpls instance 1
DM(config-l2vpn-vpls-1)# peer 3.3.3.3 pw-id 1
DM(config-l2vpn-vpls-1)# peer 4.4.4.4 pw-id 2
DM(config-l2vpn-vpls-1)# exit
```

### Associar Interface ao VSI

```bash
# Interface Ethernet no VSI (uplink para PE)
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# l2vpn vpls instance 1
DM(config-if-eth0/1)# exit
```

## L3VPN (VRF)

Para clientes corporativos com roteamento separado:

```bash
# Criar VRF
DM(config)# ip vrf CLIENTE-CORP
DM(config-vrf-CLIENTE-CORP)# rd 65001:100
DM(config-vrf-CLIENTE-CORP)# route-target import 65001:100
DM(config-vrf-CLIENTE-CORP)# route-target export 65001:100
DM(config-vrf-CLIENTE-CORP)# exit

# Associar interface ao VRF
DM(config)# interface vlan 200
DM(config-if-vlan200)# ip vrf forwarding CLIENTE-CORP
DM(config-if-vlan200)# ip address 192.168.200.1 255.255.255.0
DM(config-if-vlan200)# exit

# BGP para distribuir rotas VPNv4
DM(config)# router bgp 65001
DM(config-router-bgp-65001)# neighbor 5.5.5.5 remote-as 65001
DM(config-router-bgp-65001)# neighbor 5.5.5.5 update-source loopback 0
DM(config-router-bgp-65001)# address-family vpnv4
DM(config-router-bgp-vpnv4)# neighbor 5.5.5.5 activate
DM(config-router-bgp-vpnv4)# neighbor 5.5.5.5 send-community extended
DM(config-router-bgp-vpnv4)# exit
```

## Verificar L2VPN / VPLS

```bash
DM# show l2vpn vpls
DM# show l2vpn vpls instance 1
DM# show l2vpn vpls peer
DM# show mpls l2transport vc
DM# show l2vpn vpws instance 10
```
