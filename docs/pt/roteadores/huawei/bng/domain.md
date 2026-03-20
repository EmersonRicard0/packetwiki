# Domain AAA — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

O **Domain** é o componente central que une todos os elementos do BNG: autenticação, autorização, pools de IP e perfis de QoS.

## Criar Domain

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] authentication-scheme AUTH-PPPOE
[BNG-aaa-domain-ISP-CLIENTES] accounting-scheme ACC-PPPOE
[BNG-aaa-domain-ISP-CLIENTES] authorization-scheme AUTHOR-PPPOE
[BNG-aaa-domain-ISP-CLIENTES] radius-server RADIUS-ISP
[BNG-aaa-domain-ISP-CLIENTES] ip-pool ipv4-pool-cgnat-01
[BNG-aaa-domain-ISP-CLIENTES] ipv6-prefix-pool pool-pd-01
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Domain para Plano Específico

```bash
[BNG] aaa
[BNG-aaa] domain PLANO-100M
[BNG-aaa-domain-PLANO-100M] authentication-scheme AUTH-PPPOE
[BNG-aaa-domain-PLANO-100M] accounting-scheme ACC-PPPOE
[BNG-aaa-domain-PLANO-100M] radius-server RADIUS-ISP
[BNG-aaa-domain-PLANO-100M] ip-pool ipv4-pool-cgnat-01
[BNG-aaa-domain-PLANO-100M] user-group PLAN-100M
[BNG-aaa-domain-PLANO-100M] quit
[BNG-aaa] quit
[BNG] commit
```

## Domain Default

```bash
[BNG] aaa
[BNG-aaa] domain default
[BNG-aaa-domain-default] authentication-scheme AUTH-PPPOE
[BNG-aaa-domain-default] radius-server RADIUS-ISP
[BNG-aaa-domain-default] ip-pool ipv4-pool-cgnat-01
[BNG-aaa-domain-default] quit
[BNG-aaa] quit
[BNG] commit
```

## DNS no Domain

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] dns-server 8.8.8.8 8.8.4.4
[BNG-aaa-domain-ISP-CLIENTES] ipv6-dns-server 2001:4860:4860::8888
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Verificar Domains

```bash
<BNG> display aaa domain ISP-CLIENTES
<BNG> display access-user domain ISP-CLIENTES
<BNG> display access-user domain ISP-CLIENTES statistics
```
