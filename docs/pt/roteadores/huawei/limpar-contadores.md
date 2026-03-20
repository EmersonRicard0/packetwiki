---
description: Comandos para limpar contadores de interfaces, BGP, MPLS, ARP e cache de roteamento no roteador Huawei NE.
---

# Limpar Contadores — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Limpar Contadores de Interfaces

```bash
# Todas as interfaces
<PE01> reset counters interface

# Interface específica
<PE01> reset counters interface GigabitEthernet 1/0/0
<PE01> reset counters interface Eth-Trunk 1
<PE01> reset counters interface LoopBack 0
```

## Limpar Contadores BGP

```bash
# Todas as sessões
<PE01> reset bgp all flap-info
<PE01> reset bgp all statistics

# Sessão específica
<PE01> reset bgp 10.0.0.1 flap-info
```

## Limpar Contadores MPLS

```bash
<PE01> reset mpls ldp statistics
<PE01> reset mpls statistics
```

## Limpar Tabela ARP

```bash
<PE01> reset arp all
<PE01> reset arp dynamic
```

## Limpar Cache de Roteamento

```bash
<PE01> reset ip fast-forwarding cache
```

## Verificar Contadores após Reset

```bash
<PE01> display interface GigabitEthernet 1/0/0
# Checar: "Input/Output errors", "CRC", "Resets"

<PE01> display bgp peer
# Checar: "MsgRcvd", "MsgSent", "Up/Down"
```

::: tip Quando usar
Use `reset counters` antes de iniciar monitoramento de erros em uma interface específica, para ter uma base zerada. Não afeta o tráfego passante.
:::

---

## Veja Também

- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [BGP — Roteador Huawei](./bgp)
- [OSPF — Roteador Huawei](./ospf)
