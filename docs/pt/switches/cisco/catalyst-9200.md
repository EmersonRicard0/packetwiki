# Cisco Catalyst 9200 / 9300

::: tip Versão testada
IOS-XE **17.9.x** e **17.12.x**. Comandos válidos para ambas as versões.
:::

Os switches **Catalyst 9200 e 9300** são a linha de acesso/distribuição da Cisco baseada em **IOS-XE**, projetada para redes campus modernas com suporte a SD-Access, segurança integrada e automação via NETCONF/YANG.

## Diferenças entre 9200 e 9300

| Característica | Catalyst 9200 | Catalyst 9300 |
|----------------|--------------|--------------|
| Posição | Acesso simples | Acesso/Distribuição |
| Stacking | Não (9200L sim) | Sim — StackWise-320 |
| PoE | Até 740W | Até 1440W |
| Uplinks | 4x 1G/10G SFP | 8x 1G/10G/25G SFP |
| Licença base | Network Essentials | Network Essentials |
| SD-Access | Parcial | Completo |

## Configuração Inicial

### Primeiro acesso via console

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-ACESSO-01
```

### Configurar IP de gerenciamento

```
SW-ACESSO-01(config)# interface vlan 1
SW-ACESSO-01(config-if)# ip address 192.168.1.10 255.255.255.0
SW-ACESSO-01(config-if)# no shutdown
SW-ACESSO-01(config-if)# exit
SW-ACESSO-01(config)# ip default-gateway 192.168.1.1
```

### Habilitar SSH (desabilitar Telnet)

```
SW-ACESSO-01(config)# ip domain-name packetwiki.local
SW-ACESSO-01(config)# crypto key generate rsa modulus 2048
SW-ACESSO-01(config)# ip ssh version 2
SW-ACESSO-01(config)# line vty 0 15
SW-ACESSO-01(config-line)# transport input ssh
SW-ACESSO-01(config-line)# login local
SW-ACESSO-01(config)# username admin privilege 15 secret MinhaSenh@Forte
```

## Configuração de VLANs

### Criar e nomear VLANs

```
SW-ACESSO-01(config)# vlan 10
SW-ACESSO-01(config-vlan)# name DADOS
SW-ACESSO-01(config-vlan)# exit
SW-ACESSO-01(config)# vlan 20
SW-ACESSO-01(config-vlan)# name VOZ
SW-ACESSO-01(config-vlan)# exit
SW-ACESSO-01(config)# vlan 30
SW-ACESSO-01(config-vlan)# name CAMERAS
```

### Porta de acesso (access port)

```
SW-ACESSO-01(config)# interface GigabitEthernet1/0/1
SW-ACESSO-01(config-if)# switchport mode access
SW-ACESSO-01(config-if)# switchport access vlan 10
SW-ACESSO-01(config-if)# description PC-Escritorio-01
SW-ACESSO-01(config-if)# spanning-tree portfast
```

### Porta trunk (uplink para distribuição/core)

```
SW-ACESSO-01(config)# interface GigabitEthernet1/0/24
SW-ACESSO-01(config-if)# switchport mode trunk
SW-ACESSO-01(config-if)# switchport trunk allowed vlan 10,20,30
SW-ACESSO-01(config-if)# switchport trunk native vlan 999
SW-ACESSO-01(config-if)# description UPLINK-DISTRIBUICAO
```

### Porta de voz (access + voice VLAN)

```
SW-ACESSO-01(config)# interface GigabitEthernet1/0/5
SW-ACESSO-01(config-if)# switchport mode access
SW-ACESSO-01(config-if)# switchport access vlan 10
SW-ACESSO-01(config-if)# switchport voice vlan 20
SW-ACESSO-01(config-if)# spanning-tree portfast
SW-ACESSO-01(config-if)# description IP-PHONE-01
```

## PoE (Power over Ethernet)

```
# Ver status PoE de todas as portas
SW-ACESSO-01# show power inline

# Definir limite de potência por porta
SW-ACESSO-01(config)# interface GigabitEthernet1/0/3
SW-ACESSO-01(config-if)# power inline consumption 7000
# (7000 mW = 7W — para APs por exemplo)

# Desabilitar PoE em uma porta
SW-ACESSO-01(config-if)# power inline never
```

## Stacking (apenas Catalyst 9300)

```
# Ver membros do stack
SW-ACESSO-01# show switch

# Ver cabos do stack
SW-ACESSO-01# show switch stack-ports

# Definir switch master (priority mais alta = master)
SW-ACESSO-01(config)# switch 1 priority 15
```

## Segurança de Porta

```
# Limitar MACs por porta (evitar loops/hubs)
SW-ACESSO-01(config)# interface GigabitEthernet1/0/1
SW-ACESSO-01(config-if)# switchport port-security
SW-ACESSO-01(config-if)# switchport port-security maximum 2
SW-ACESSO-01(config-if)# switchport port-security violation restrict
SW-ACESSO-01(config-if)# switchport port-security aging time 10
```

## Comandos de Verificação

| Objetivo | Comando |
|----------|---------|
| Ver VLANs | `show vlan brief` |
| Ver trunks | `show interfaces trunk` |
| Ver spanning-tree | `show spanning-tree vlan 10` |
| Ver tabela MAC | `show mac address-table` |
| Ver erros de interface | `show interfaces counters errors` |
| Ver PoE | `show power inline` |
| Ver stack | `show switch` |
| Ver versão IOS | `show version` |
| Ver config atual | `show running-config` |

## Salvar Configuração

```
SW-ACESSO-01# write memory
! ou
SW-ACESSO-01# copy running-config startup-config
```

## Problemas Comuns

### Interface não sobe após configuração de VLAN

```
# Verificar se a VLAN existe no banco de VLANs
SW-ACESSO-01# show vlan brief

# Verificar status da interface
SW-ACESSO-01# show interfaces GigabitEthernet1/0/1 status
```

### Trunk não passa certas VLANs

```
# Verificar VLANs permitidas no trunk
SW-ACESSO-01# show interfaces GigabitEthernet1/0/24 trunk

# Verificar se a VLAN está ativa
SW-ACESSO-01# show vlan id 30
```

### SSH não conecta

```
# Verificar se o serviço está ativo
SW-ACESSO-01# show ip ssh

# Verificar ACL nas linhas VTY
SW-ACESSO-01# show running-config | section line vty
```

## Veja Também

- [Cisco Catalyst 2960](/pt/switches/cisco/catalyst-2960)
- [Cisco Nexus 9000](/pt/switches/cisco/nexus-9000)
- [Switches Huawei — VLAN](/pt/switches/huawei/vlan)
- [Switches Datacom — VLAN](/pt/switches/datacom/vlan)
