# Configuração Inicial — Switch Datacom

::: tip Versão testada
DmOS **21.1** (DM2500 / DM4370 / DM4610). Compatível com DmOS 19.x+.
:::

## Acesso Inicial

### Console / Serial

```
Velocidade: 115200 bps
Bits de dados: 8
Paridade: Nenhuma
Bits de parada: 1
```

### Login Padrão

```
Usuário: admin
Senha: admin
```

## Configuração Básica

```bash
# Modo privilegiado
DM> enable

# Modo de configuração
DM# configure terminal

# Hostname
DM(config)# hostname SW-DIST-01

# Salvar
SW-DIST-01# write memory
```

## Usuários e Senhas

```bash
# Usuário administrativo
SW-DIST-01(config)# username admin privilege 15 secret SenhaForte@123

# Senha de enable
SW-DIST-01(config)# enable secret SenhaEnable@123
```

## Interface de Gerência

```bash
# VLAN de gerência
SW-DIST-01(config)# vlan 999
SW-DIST-01(config-vlan-999)# name GERENCIA
SW-DIST-01(config-vlan-999)# exit

# SVI (interface VLAN roteada)
SW-DIST-01(config)# interface vlan 999
SW-DIST-01(config-if-vlan999)# ip address 10.0.0.10 255.255.255.0
SW-DIST-01(config-if-vlan999)# no shutdown
SW-DIST-01(config-if-vlan999)# exit

# Rota padrão
SW-DIST-01(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1
```

## SSH

```bash
SW-DIST-01(config)# crypto key generate rsa modulus 2048
SW-DIST-01(config)# ip ssh version 2
SW-DIST-01(config)# ip ssh time-out 60
SW-DIST-01(config)# ip ssh authentication-retries 3

# Habilitar acesso SSH no VTY
SW-DIST-01(config)# line vty 0 15
SW-DIST-01(config-line-vty)# transport input ssh
SW-DIST-01(config-line-vty)# login local
SW-DIST-01(config-line-vty)# exec-timeout 30 0
SW-DIST-01(config-line-vty)# exit
```

## SNMP

```bash
# SNMPv2c
SW-DIST-01(config)# snmp-server community public ro
SW-DIST-01(config)# snmp-server community private rw
SW-DIST-01(config)# snmp-server host 10.0.0.5 traps version 2c public

# SNMPv3
SW-DIST-01(config)# snmp-server group SNMPv3-RO v3 priv read all-mib
SW-DIST-01(config)# snmp-server user monitor SNMPv3-RO v3 auth sha SenhaAuth@123 priv aes 128 SenhaPriv@456
```

## NTP e Horário

```bash
SW-DIST-01(config)# clock timezone BRT -3
SW-DIST-01(config)# ntp server 200.160.7.186
SW-DIST-01(config)# ntp server 200.20.186.76
```

## Syslog

```bash
SW-DIST-01(config)# logging host 10.0.0.100
SW-DIST-01(config)# logging facility local6
SW-DIST-01(config)# logging level informational
```

## Verificar Status

```bash
SW-DIST-01# show version
SW-DIST-01# show running-config
SW-DIST-01# show interface vlan 999
SW-DIST-01# show ip route
SW-DIST-01# show users
