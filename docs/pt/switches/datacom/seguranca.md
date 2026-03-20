# Segurança — Switch Datacom

::: tip Versão testada
DmOS **21.1** (DM2500 / DM4370 / DM4610). Compatível com DmOS 19.x+.
:::

## ACL (Access Control Lists)

### ACL Padrão (Standard — filtra por IP origem)

```bash
DM(config)# ip access-list standard BLOQUEAR-SUBNET
DM(config-acl-std)# deny 192.168.100.0 0.0.0.255
DM(config-acl-std)# permit any
DM(config-acl-std)# exit

# Aplicar na interface
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# ip access-group BLOQUEAR-SUBNET in
DM(config-if-eth0/1)# exit
```

### ACL Estendida (Extended — filtra por IP/porta/protocolo)

```bash
DM(config)# ip access-list extended GERENCIA-SSH
DM(config-acl-ext)# permit tcp 10.0.0.0 0.0.0.255 any eq 22
DM(config-acl-ext)# permit tcp 10.1.0.0 0.0.0.255 any eq 22
DM(config-acl-ext)# deny tcp any any eq 22
DM(config-acl-ext)# permit ip any any
DM(config-acl-ext)# exit

# Aplicar em interface de gerência
DM(config)# interface vlan 999
DM(config-if-vlan999)# ip access-group GERENCIA-SSH in
DM(config-if-vlan999)# exit
```

### ACL em VLAN (VACL)

```bash
DM(config)# vlan access-map BLOQUEIO-INTER-VLAN 10
DM(config-vacm)# match ip address BLOQUEAR-SUBNET
DM(config-vacm)# action drop
DM(config-vacm)# exit

DM(config)# vlan access-map BLOQUEIO-INTER-VLAN 20
DM(config-vacm)# action forward
DM(config-vacm)# exit

DM(config)# vlan filter BLOQUEIO-INTER-VLAN vlan-list 10
```

## Port Security

Limita quais MACs podem operar em uma porta:

```bash
DM(config)# interface ethernet 0/5
DM(config-if-eth0/5)# switchport mode access
DM(config-if-eth0/5)# switchport port-security
DM(config-if-eth0/5)# switchport port-security maximum 3
DM(config-if-eth0/5)# switchport port-security violation shutdown
DM(config-if-eth0/5)# switchport port-security mac-address sticky
DM(config-if-eth0/5)# exit
```

| Ação em violação | Comportamento |
|-----------------|---------------|
| `shutdown` | Desliga a porta (err-disabled) |
| `restrict` | Descarta pacotes e gera log |
| `protect` | Descarta pacotes silenciosamente |

### Reativar porta em err-disabled

```bash
DM(config)# interface ethernet 0/5
DM(config-if-eth0/5)# shutdown
DM(config-if-eth0/5)# no shutdown
DM(config-if-eth0/5)# exit
```

## DHCP Snooping

Previne servidores DHCP não autorizados:

```bash
# Habilitar globalmente
DM(config)# ip dhcp snooping
DM(config)# ip dhcp snooping vlan 10,20

# Configurar porta confiável (uplink para servidor DHCP legítimo)
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# ip dhcp snooping trust
DM(config-if-eth0/24)# exit

# Limitar taxa em portas de acesso (anti-flood)
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# ip dhcp snooping limit rate 15
DM(config-if-eth0/1)# exit
```

## Dynamic ARP Inspection (DAI)

Previne ataques ARP spoofing:

```bash
DM(config)# ip arp inspection vlan 10,20

# Porta confiável (usa a tabela do DHCP snooping)
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# ip arp inspection trust
DM(config-if-eth0/24)# exit
```

## IP Source Guard

Filtra pacotes com IP/MAC não autorizados (baseado na tabela DHCP snooping):

```bash
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# ip verify source
DM(config-if-eth0/1)# exit
```

## BPDU Guard e Root Guard

```bash
# BPDU Guard — protege portas de acesso contra loops
DM(config)# spanning-tree portfast bpduguard default

# Root Guard — protege a raiz do STP
DM(config)# interface ethernet 0/20
DM(config-if-eth0/20)# spanning-tree guard root
DM(config-if-eth0/20)# exit
```

## CFM (Connectivity Fault Management)

Para monitoramento de conectividade L2 em redes de operadoras:

```bash
# Criar domínio CFM
DM(config)# ethernet cfm domain OPERADORA level 5
DM(config-cfm-domain)# service CLIENTE-A vlan 100
DM(config-cfm-service)# continuity-check
DM(config-cfm-service)# exit

# Habilitar na interface
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# ethernet cfm mep domain OPERADORA service CLIENTE-A mep-id 1 up
DM(config-if-eth0/1)# exit
```

## Verificar Segurança

```bash
DM# show ip access-lists
DM# show port-security
DM# show port-security interface ethernet 0/5
DM# show ip dhcp snooping
DM# show ip dhcp snooping binding
DM# show ip arp inspection
DM# show ethernet cfm
