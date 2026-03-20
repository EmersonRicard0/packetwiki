# VLANs e Interfaces — Switch Datacom

::: tip Versão testada
DmOS **21.1** (DM2500 / DM4370 / DM4610). Compatível com DmOS 19.x+.
:::

## Criar VLANs

```bash
DM(config)# vlan 10
DM(config-vlan-10)# name CLIENTES
DM(config-vlan-10)# exit

DM(config)# vlan 20
DM(config-vlan-20)# name VOIP
DM(config-vlan-20)# exit

DM(config)# vlan 999
DM(config-vlan-999)# name GERENCIA
DM(config-vlan-999)# exit
```

## Interfaces Access (portas de acesso)

```bash
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# switchport mode access
DM(config-if-eth0/1)# switchport access vlan 10
DM(config-if-eth0/1)# spanning-tree portfast
DM(config-if-eth0/1)# no shutdown
DM(config-if-eth0/1)# exit
```

## Interfaces Trunk

```bash
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# switchport mode trunk
DM(config-if-eth0/24)# switchport trunk native vlan 1
DM(config-if-eth0/24)# switchport trunk allowed vlan add 10,20,999
DM(config-if-eth0/24)# no shutdown
DM(config-if-eth0/24)# exit
```

## Interface SVI (VLAN Roteada / L3)

```bash
# SVI para roteamento inter-VLAN
DM(config)# interface vlan 10
DM(config-if-vlan10)# ip address 10.10.10.1 255.255.255.0
DM(config-if-vlan10)# no shutdown
DM(config-if-vlan10)# exit

DM(config)# interface vlan 20
DM(config-if-vlan20)# ip address 10.20.20.1 255.255.255.0
DM(config-if-vlan20)# no shutdown
DM(config-if-vlan20)# exit
```

## Link Aggregation (LAG / LACP)

### Criar Port-Channel

```bash
# Criar interface de agregação
DM(config)# interface port-channel 1
DM(config-if-po1)# switchport mode trunk
DM(config-if-po1)# switchport trunk allowed vlan add 10,20,999
DM(config-if-po1)# no shutdown
DM(config-if-po1)# exit

# Associar portas físicas ao port-channel (LACP ativo)
DM(config)# interface ethernet 0/25
DM(config-if-eth0/25)# channel-group 1 mode active
DM(config-if-eth0/25)# exit

DM(config)# interface ethernet 0/26
DM(config-if-eth0/26)# channel-group 1 mode active
DM(config-if-eth0/26)# exit
```

### Verificar LAG

```bash
DM# show lacp neighbor
DM# show interface port-channel 1
DM# show etherchannel summary
```

## Spanning Tree

### RSTP (Recomendado)

```bash
DM(config)# spanning-tree mode rstp
DM(config)# spanning-tree priority 4096    # tornar bridge root

# PortFast em portas de acesso (sem STP)
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# spanning-tree portfast
DM(config-if-eth0/1)# exit

# BPDU Guard — proteger portas de acesso
DM(config)# spanning-tree portfast bpduguard default
```

### MSTP (múltiplas instâncias)

```bash
DM(config)# spanning-tree mode mstp
DM(config)# spanning-tree mst configuration
DM(config-mst)# name REDE-PROVEDOR
DM(config-mst)# revision 1
DM(config-mst)# instance 1 vlan 10-99
DM(config-mst)# instance 2 vlan 100-199
DM(config-mst)# exit
DM(config)# spanning-tree mst 1 priority 4096
DM(config)# spanning-tree mst 2 priority 8192
```

## Q-in-Q (Double Tagging)

Para agregar múltiplos clientes em uma única VLAN de transporte:

```bash
# Habilitar Q-in-Q na porta de uplink
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# switchport mode dot1q-tunnel
DM(config-if-eth0/24)# switchport access vlan 1000
DM(config-if-eth0/24)# exit

# Habilitar na porta de cliente
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# switchport mode access
DM(config-if-eth0/1)# switchport access vlan 10
DM(config-if-eth0/1)# exit
```

## Verificar VLANs e Interfaces

```bash
DM# show vlan
DM# show vlan 10
DM# show interface ethernet 0/1
DM# show interface status
DM# show interface trunk
DM# show mac address-table vlan 10
DM# show spanning-tree
