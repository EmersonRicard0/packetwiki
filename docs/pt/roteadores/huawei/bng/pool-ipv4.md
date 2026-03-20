# Pool IPv4 — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Criar Pool IPv4 (CGNAT)

```bash
[BNG] ip pool ipv4-pool-cgnat-01 bas local
[BNG-ip-pool-ipv4-pool-cgnat-01] gateway 100.64.0.1
[BNG-ip-pool-ipv4-pool-cgnat-01] section 0 100.64.0.2 100.64.63.254
[BNG-ip-pool-ipv4-pool-cgnat-01] dns-server 8.8.8.8 8.8.4.4
[BNG-ip-pool-ipv4-pool-cgnat-01] lease day 1 hour 0 minute 0
[BNG-ip-pool-ipv4-pool-cgnat-01] quit
[BNG] commit
```

## Criar Pool IPv4 (Endereço Público)

```bash
[BNG] ip pool ipv4-pool-pub-01 bas local
[BNG-ip-pool-ipv4-pool-pub-01] gateway 200.100.1.1
[BNG-ip-pool-ipv4-pool-pub-01] section 0 200.100.1.10 200.100.1.254
[BNG-ip-pool-ipv4-pool-pub-01] dns-server 1.1.1.1 8.8.8.8
[BNG-ip-pool-ipv4-pool-pub-01] lease day 1 hour 0 minute 0
[BNG-ip-pool-ipv4-pool-pub-01] quit
[BNG] commit
```

## Associar Pool ao Domínio

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] ip-pool ipv4-pool-cgnat-01
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Múltiplos Pools com Fallback

```bash
[BNG] aaa
[BNG-aaa] domain ISP-CLIENTES
[BNG-aaa-domain-ISP-CLIENTES] ip-pool ipv4-pool-cgnat-01
[BNG-aaa-domain-ISP-CLIENTES] ip-pool ipv4-pool-cgnat-02
[BNG-aaa-domain-ISP-CLIENTES] quit
[BNG-aaa] quit
[BNG] commit
```

## Verificar Pools

```bash
<BNG> display ip pool name ipv4-pool-cgnat-01
<BNG> display ip pool name ipv4-pool-cgnat-01 used
<BNG> display ip pool name ipv4-pool-cgnat-01 free
<BNG> display ip pool all
```

### Saída do display ip pool:
```
Pool-name      : ipv4-pool-cgnat-01
Pool-No        : 1
Position       : Local
Status         : Unlocked
Gateway        : 100.64.0.1
Mask           : 255.255.192.0
Total          : 16382
Used           : 4512
Idle           : 11870
```
