# Virtual-Template (PPPoE) — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Configurar Virtual-Template PPPoE

```bash
[BNG] interface Virtual-Template 1
[BNG-Virtual-Template1] ppp authentication-mode chap
[BNG-Virtual-Template1] ppp ipcp dns admit-any
[BNG-Virtual-Template1] ip address unnumbered interface LoopBack 0
[BNG-Virtual-Template1] mtu 1492
[BNG-Virtual-Template1] quit
[BNG] commit
```

## Associar ao PPPoE Server

```bash
[BNG] interface GigabitEthernet 1/0/0
[BNG-GE1/0/0] pppoe-server bind Virtual-Template 1
[BNG-GE1/0/0] quit
[BNG] commit
```

## Virtual-Template com IPv6

```bash
[BNG] interface Virtual-Template 1
[BNG-Virtual-Template1] ipv6 enable
[BNG-Virtual-Template1] ppp ipv6cp dns admit-any
[BNG-Virtual-Template1] quit
[BNG] commit
```

## Limitar Sessões por Interface

```bash
[BNG] interface GigabitEthernet 1/0/0
[BNG-GE1/0/0] pppoe-server max-sessions 8000
[BNG-GE1/0/0] quit
[BNG] commit
```

## Virtual-Template com QoS

```bash
[BNG] interface Virtual-Template 1
[BNG-Virtual-Template1] traffic-policy POL-CLIENTES inbound
[BNG-Virtual-Template1] traffic-policy POL-CLIENTES outbound
[BNG-Virtual-Template1] quit
[BNG] commit
```

## Verificar PPPoE Server

```bash
<BNG> display pppoe-server session summary
<BNG> display pppoe-server session all
<BNG> display interface Virtual-Template 1
<BNG> display access-user all statistics
```

## Encerrar Sessão de Usuário

```bash
# Por username
<BNG> cut access-user username user01@isp

# Por IP
<BNG> cut access-user ip 100.64.1.50

# Todas as sessões de um domain
<BNG> cut access-user domain ISP-CLIENTES
```
