---
description: Gerência da OLT Huawei MA5800 — auto-save, backup FTP/TFTP, NTP, SNMP, syslog e atualização de firmware.
---

# Gerência do Device — OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

## Auto Save

```bash
# Configurar horário de auto-save (18:30)
(config)# autosave time 18:30:00
(config)# autosave type configuration
(config)# autosave time on

# Verificar
(config)# display autosave configuration
```

## Backup de Configuração

### Via FTP

```bash
# Backup manual via FTP
MA5800-X2# backup configuration ftp 192.168.102.7 OLT-01.dat

# Configurar servidor FTP primário e secundário
MA5800-X2(config)# file-server auto-backup configuration primary 10.11.104.103 ftp user
  User Name: user01
  User Password: user01
MA5800-X2(config)# file-server auto-backup configuration secondary 172.16.4.10 tftp

# Verificar configuração
MA5800-X2(config)# display file-server auto-backup configuration
```

### Via TFTP

```bash
MA5800-X2(config)# backup configuration tftp 10.11.104.17 config.dat
```

### Backup de Database (dados de ONUs)

```bash
MA5800-X2# backup data ftp 192.168.102.7 OLT-01-data.dat
```

### Backup Automático Periódico

```bash
MA5800-X2(config)# auto-backup period configuration enable
MA5800-X2(config)# auto-backup period configuration interval 1 time 05:00
MA5800-X2(config)# display auto-backup period configuration
```

## Restore de Configuração

```bash
# Restaurar configuração via TFTP
MA5800-X2# load configuration tftp 10.11.104.17 config.dat all
MA5800-X2# active configuration system
MA5800-X2# reboot

# Restaurar database via FTP
MA5800-X2# load data ftp 10.11.104.17 OLT-01-data.dat all
MA5800-X2# active configuration system
MA5800-X2# reboot
```

## Data e Hora / NTP

```bash
(config)# timezone gmt- 03:00
(config)# time 2024-01-15 15:21:00
(config)# time date-format DD-MM-YYYY

# Configurar NTP
(config)# ntp-service refclock-master 4
(config)# undo ntp-service server disable
(config)# ntp-service unicast-server 200.160.0.8

# Verificar
(config)# display ntp-service status
(config)# display time
```

## SNMP

```bash
(config)# snmp-agent local-engineid 800007DB033CA37EB5E477
(config)# snmp-agent community read cipher Gerencia@2024
(config)# sysman server source snmp any-interface
(config)# sysman server source snmp ipv6 ::
```

## Syslog

```bash
(config)# loghost add 10.11.104.100 logserver1
(config)# loghost activate name logserver1
(config)# syslog enable alarm-event
(config)# syslog output all
(config)# syslog source meth 0
(config)# syslog source vlanif 543

# Verificar
(config)# display syslog alarm-event format
(config)# display syslog output configuration
(config)# display syslog priority
```

## Atualização de Firmware

```bash
# Verificar versão atual
MA5800-X2(config)# display version
# VERSION : MA5800V100R018C10
# PATCH   : SPH102
# PRODUCT : MA5800-X2
```

---

## Veja Também

- [Configuração Inicial — OLT Huawei](./configuracao-inicial)
- [Interfaces e VLANs — OLT Huawei](./interface-vlan)
- [Troubleshooting / Sinal — OLT Huawei](./troubleshooting)
