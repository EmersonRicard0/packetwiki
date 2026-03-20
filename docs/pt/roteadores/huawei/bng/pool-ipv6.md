# Pool IPv6 — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Criar Pool IPv6 para Prefix Delegation (PD)

```bash
[BNG] ipv6 prefix pool-pd-01 delegation
[BNG-ipv6-prefix-pool-pd-01] prefix-range 2804:CAFE:100:: 48 assign-length 56
[BNG-ipv6-prefix-pool-pd-01] quit

[BNG] ipv6 prefix pool-pd-02 delegation
[BNG-ipv6-prefix-pool-pd-02] prefix-range 2804:CAFE:200:: 48 assign-length 56
[BNG-ipv6-prefix-pool-pd-02] quit
[BNG] commit
```

## Criar Pool IPv6 para Endereço de WAN (SLAAC/DHCPv6)

```bash
[BNG] ipv6 pool pool-ipv6-wan local
[BNG-ipv6-pool-pool-ipv6-wan] prefix 2804:CAFE:FF00:: 48
[BNG-ipv6-pool-pool-ipv6-wan] dns-server 2001:4860:4860::8888
[BNG-ipv6-pool-pool-ipv6-wan] quit
[BNG] commit
```

## Associar Pools IPv6 ao Domínio

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] ipv6-prefix-pool pool-pd-01
[BNG-aaa-domain-ISP-CLIENTES] ipv6-pool pool-ipv6-wan
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Configurar DHCPv6 no Virtual-Template

```bash
[BNG] interface Virtual-Template 1
[BNG-Virtual-Template1] pppoe-server bind Virtual-Template 1
[BNG-Virtual-Template1] ipv6 enable
[BNG-Virtual-Template1] ipv6 nd ra halt
[BNG-Virtual-Template1] dhcpv6 server enable
[BNG-Virtual-Template1] quit
[BNG] commit
```

## Verificar IPv6

```bash
<BNG> display ipv6 prefix pool pool-pd-01
<BNG> display ipv6 prefix pool pool-pd-01 used
<BNG> display access-user ipv6 all
<BNG> display pppoe-server session summary ipv6
```
