# Serviços GPON — OLT Datacom

::: tip Versão testada
DmOS **21.1** (DM4615 / DM4610). Compatível com DmOS 19.x+.
:::

## VLANs de Serviço

### Criar VLANs

```bash
DM(config)# vlan 100
DM(config-vlan-100)# name INTERNET
DM(config-vlan-100)# exit

DM(config)# vlan 11
DM(config-vlan-11)# name VOIP
DM(config-vlan-11)# exit

DM(config)# vlan 200
DM(config-vlan-200)# name IPTV
DM(config-vlan-200)# exit
```

### Associar VLAN ao Uplink

```bash
# Interface de uplink (porta Ethernet/SFP+)
DM(config)# interface ethernet 0/0
DM(config-if-eth0/0)# switchport mode trunk
DM(config-if-eth0/0)# switchport trunk allowed vlan add 100,11,200
DM(config-if-eth0/0)# no shutdown
DM(config-if-eth0/0)# exit
```

## Modos de VLAN na ONU

### Modo Tagged (trunking)

O tráfego passa com tag VLAN preservada:

```bash
DM(config-gpon)# service-port 1
DM(config-gpon-sp-1)# vlan-mode tagged
DM(config-gpon-sp-1)# vlan 100
DM(config-gpon-sp-1)# exit
```

### Modo Untagged (access)

Remove a tag VLAN ao entregar para o cliente:

```bash
DM(config-gpon)# service-port 2
DM(config-gpon-sp-2)# vlan-mode untagged
DM(config-gpon-sp-2)# vlan 100
DM(config-gpon-sp-2)# exit
```

### Modo Translate (Q-in-Q / Double-Tag)

Traduz VLAN do cliente para VLAN da operadora:

```bash
DM(config-gpon)# service-port 3
DM(config-gpon-sp-3)# vlan-mode translate inner-vlan 10 outer-vlan 100
DM(config-gpon-sp-3)# exit
```

## Controle de Banda Downstream

O DmOS permite controle de banda individual por service-port:

```bash
DM(config-gpon)# service-port 10
DM(config-gpon-sp-10)# traffic-limit downstream cir 102400 cbs 1024
DM(config-gpon-sp-10)# exit
```

> **CIR:** Committed Information Rate em Kbps. **CBS:** Committed Burst Size em KB.

## Exemplo Completo — ISP com PPPoE

Topologia: OLT → (VLAN 100) → BNG → PPPoE → Cliente

```bash
# 1. Criar VLAN de serviço
DM(config)# vlan 100
DM(config-vlan-100)# name PPPoE-CLIENTES
DM(config-vlan-100)# exit

# 2. Associar VLAN ao uplink
DM(config)# interface ethernet 0/0
DM(config-if-eth0/0)# switchport mode trunk
DM(config-if-eth0/0)# switchport trunk allowed vlan add 100
DM(config-if-eth0/0)# exit

# 3. Criar bandwidth-profile
DM(config)# gpon
DM(config-gpon)# bandwidth-profile 10 name "1G"
DM(config-gpon-bwprofile-10)# type best-effort maximum 1024000
DM(config-gpon-bwprofile-10)# exit

# 4. Criar line-profile
DM(config-gpon)# line-profile 10 name "LP-PPPoE"
DM(config-gpon-lineprofile-10)# tcont 1 bandwidth-profile 10
DM(config-gpon-lineprofile-10)# gem-port 1 tcont 1
DM(config-gpon-lineprofile-10)# gem-port 1 vlan 100
DM(config-gpon-lineprofile-10)# exit

# 5. Criar service-profile
DM(config-gpon)# service-profile 10 name "SP-PPPoE"
DM(config-gpon-srvprofile-10)# ont-port eth 4 pots 0
DM(config-gpon-srvprofile-10)# port vlan eth 1 100
DM(config-gpon-srvprofile-10)# port vlan eth 2 100
DM(config-gpon-srvprofile-10)# port vlan eth 3 100
DM(config-gpon-srvprofile-10)# port vlan eth 4 100
DM(config-gpon-srvprofile-10)# exit

# 6. Autorizar ONU
DM(config)# interface gpon 0/1
DM(config-if-gpon0/1)# onu 1 serial-number HWTC1A2B3C4D
DM(config-if-gpon0/1)# onu 1 line-profile 10
DM(config-if-gpon0/1)# onu 1 service-profile 10
DM(config-if-gpon0/1)# exit

# 7. Criar service-port
DM(config-gpon)# service-port 100
DM(config-gpon-sp-100)# onu interface gpon 0/1 onu-id 1
DM(config-gpon-sp-100)# gem-port 1
DM(config-gpon-sp-100)# vlan 100
DM(config-gpon-sp-100)# no shutdown
DM(config-gpon-sp-100)# exit
```

## Verificar Serviços

```bash
# Service-ports ativos
DM# show gpon service-port
DM# show gpon service-port interface gpon 0/1

# Contadores de tráfego por service-port
DM# show gpon service-port counters 100

# Status das VLANs
DM# show vlan
DM# show vlan 100

# Interface de uplink
DM# show interface ethernet 0/0
```
