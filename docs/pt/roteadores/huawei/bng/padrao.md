# Padrão para Novos Roteadores PPPoE — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Checklist de configurações que devem estar presentes em todos os BNGs novos.

## 1. DHCPv6 DUID

```bash
[BNG] dhcpv6 duid llt
[BNG] commit
```

## 2. AAA Global

```bash
[BNG] aaa
# Habilitar CoA globalmente
[BNG-aaa] authorization-cmd enable
# Desabilitar domain name no username enviado ao RADIUS
[BNG-aaa] undo domain-name-delimiter
[BNG-aaa] quit
[BNG] commit
```

## 3. PPPoE Global

```bash
[BNG] pppoe-server ppp-max-payload 1500
[BNG] commit
```

## 4. Parâmetros PPP Globais

```bash
[BNG] ppp keepalive retry 3
[BNG] ppp timeout ncp 30
[BNG] commit
```

## 5. RADIUS com Atributos Corretos

```bash
[BNG] radius-server template RADIUS-ISP
[BNG-radius-RADIUS-ISP] undo radius-server user-name domain-included
[BNG-radius-RADIUS-ISP] radius-attribute nas-ip 10.255.1.1
[BNG-radius-RADIUS-ISP] timer response-timeout 5
[BNG-radius-RADIUS-ISP] retransmit 3
[BNG-radius-RADIUS-ISP] quit
[BNG] commit
```

## 6. MTU nas Interfaces

```bash
# Virtual-Template com MTU PPPoE
[BNG] interface Virtual-Template 1
[BNG-Virtual-Template1] mtu 1492
[BNG-Virtual-Template1] quit

# Interface física uplink com MTU maior
[BNG] interface GigabitEthernet 1/0/0
[BNG-GE1/0/0] mtu 1500
[BNG-GE1/0/0] quit
[BNG] commit
```

## 7. Snmp, Log e NTP

```bash
# NTP
[BNG] ntp-service unicast-server 200.160.0.8
[BNG] clock timezone BRT minus 03:00:00

# SNMP
[BNG] snmp-agent
[BNG] snmp-agent community read cipher Gerencia@2024
[BNG] snmp-agent trap source LoopBack 0
[BNG] snmp-agent trap enable

# Syslog
[BNG] info-center loghost 10.0.0.100
[BNG] info-center loghost source LoopBack 0
[BNG] commit
```

## 8. Verificação Final

```bash
<BNG> display pppoe-server session summary
<BNG> display ip pool all
<BNG> display aaa domain default
<BNG> display radius-server template RADIUS-ISP
<BNG> display snmp-agent status
<BNG> display ntp-service status
```
