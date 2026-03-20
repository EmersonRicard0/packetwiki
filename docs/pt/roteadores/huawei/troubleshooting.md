---
description: Comandos de diagnóstico para roteadores Huawei NE — interfaces, OSPF, BGP, MPLS, BFD, ARP e debug.
---

# Troubleshooting — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Referência rápida de diagnóstico para roteadores Huawei NE. Organizado por camada e protocolo. Use os comandos `display` para leitura passiva e `debugging` apenas em manutenções programadas — geram saída intensa que pode impactar a CPU do equipamento.

::: warning Modelo candidato/commit
No NE, alterações corretivas (como ativar uma interface) também precisam de `commit`. Use `display configuration candidate` para confirmar o que ainda não foi aplicado.
:::

---

## Estado Geral do Equipamento

```bash
# Versão VRP e hardware
<PE01> display version
<PE01> display device

# Uso de CPU e memória
<PE01> display cpu-usage
<PE01> display memory-usage

# Alarmes ativos
<PE01> display alarm active
```

---

## Interface e Conectividade

```bash
# Resumo de todas as interfaces
<PE01> display interface brief
<PE01> display ip interface brief

# Detalhes de uma interface específica
<PE01> display interface GigabitEthernet 1/0/0

# Resetar contadores para análise limpa
<PE01> reset counters interface GigabitEthernet 1/0/0
```

---

## Ping e Traceroute

```bash
# Ping simples
<PE01> ping 8.8.8.8

# Ping com IP de origem específico (para testar via loopback)
<PE01> ping -a 10.255.1.1 8.8.8.8

# Ping com pacotes grandes (testar MTU/fragmentação)
<PE01> ping -s 1400 -c 100 8.8.8.8

# Traceroute
<PE01> tracert 8.8.8.8

# Traceroute com source específico
<PE01> tracert -a 10.255.1.1 8.8.8.8
```

---

## Roteamento

```bash
# Tabela de roteamento completa
<PE01> display ip routing-table

# Verificar rota específica
<PE01> display ip routing-table 10.0.0.0 24

# Detalhes de todas as rotas (inclui atributos)
<PE01> display ip routing-table verbose

# Estatísticas da tabela de roteamento
<PE01> display ip routing-table statistics
```

---

## OSPF

```bash
# Estado dos vizinhos (esperado: FULL)
<PE01> display ospf peer
<PE01> display ospf peer brief

# Interfaces OSPF
<PE01> display ospf interface

# Rotas aprendidas via OSPF
<PE01> display ospf routing

# LSDB (base de dados do OSPF)
<PE01> display ospf lsdb
```

---

## BGP

```bash
# Estado dos peers (esperado: Established)
<PE01> display bgp peer

# Tabela BGP
<PE01> display bgp routing-table

# Rotas recebidas de um peer
<PE01> display bgp routing-table peer 10.0.0.1 received-routes

# Rotas anunciadas para um peer
<PE01> display bgp routing-table peer 10.0.0.1 advertised-routes

# Soft reset sem derrubar sessão
<PE01> refresh bgp all import
<PE01> refresh bgp all export
```

---

## MPLS / LDP

```bash
# Todos os LSPs ativos
<PE01> display mpls lsp

# Sessões LDP (esperado: Operational)
<PE01> display mpls ldp session

# Peers LDP
<PE01> display mpls ldp peer

# Ping no plano MPLS
<PE01> ping mpls ldp ip 10.255.2.2 32

# Traceroute MPLS
<PE01> tracert mpls ldp ip 10.255.2.2 32
```

---

## BFD (Bidirectional Forwarding Detection)

```bash
# Todas as sessões BFD
<PE01> display bfd session all

# Resumo das sessões BFD
<PE01> display bfd session brief
```

---

## ARP

```bash
# Tabela ARP completa
<PE01> display arp

# Limpar tabela ARP (cuidado em produção)
<PE01> reset arp all
```

---

## Logs Recentes

```bash
# Ver últimas mensagens do sistema
<PE01> display logbuffer

# Filtrar por nível de severidade
<PE01> display logbuffer level warnings
```

---

## Debug (usar com extrema cautela em produção)

```bash
# Debug BGP
<PE01> debugging bgp all

# Debug OSPF
<PE01> debugging ospf event

# Debug LDP
<PE01> debugging mpls ldp all

# SEMPRE desabilitar após uso
<PE01> undo debugging all
```

---

## Fluxo de Diagnóstico Rápido

1. **Verificar hardware** → `display device` / `display alarm active`
2. **Verificar interfaces** → `display interface brief`
3. **Verificar roteamento** → `display ip routing-table`
4. **Testar conectividade** → `ping` / `tracert`
5. **Verificar protocolo** → OSPF peer / BGP peer / MPLS LDP session
6. **Ver logs** → `display logbuffer`

---

## Veja Também

- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [OSPF — Roteador Huawei](./ospf)
- [BGP — Roteador Huawei](./bgp)
- [Troubleshooting — Switch Huawei](/pt/switches/huawei/troubleshooting)
