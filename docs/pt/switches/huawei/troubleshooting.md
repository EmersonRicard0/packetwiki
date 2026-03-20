---
description: Comandos de diagnóstico para switches Huawei — interfaces, OSPF, BGP, MPLS, L2VPN, ARP, STP e debug.
---

# Troubleshooting — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Referência rápida de diagnóstico para switches Huawei. Organizado por camada e protocolo — use os comandos `display` para leitura passiva e `debugging` apenas em manutenções programadas, pois podem impactar a CPU do equipamento.

::: warning
Comandos `debugging` geram saída intensiva na CLI. Sempre execute `undo debugging all` ao terminar. Em produção, prefira os comandos `display` e testes de ping/tracert direcionados.
:::

---

## Estado Geral do Equipamento

```bash
# Informações de hardware e versão VRP
<SW> display device
<SW> display version

# Uso de CPU e memória
<SW> display cpu-usage
<SW> display memory-usage

# Temperatura e ventilação
<SW> display health
```

---

## Interfaces

```bash
# Resumo de todas as interfaces (estado físico e protocolo)
<SW> display interface brief

# Detalhes de uma interface específica
<SW> display interface GigabitEthernet 0/0/1

# Contadores de tráfego e erros
<SW> display counters interface GigabitEthernet 0/0/1

# Resetar contadores para facilitar análise
<SW> reset counters interface GigabitEthernet 0/0/1
```

---

## Roteamento

```bash
# Tabela de roteamento completa
<SW> display ip routing-table

# Verificar rota específica com detalhes
<SW> display ip routing-table 10.0.0.0 24 verbose

# Verificar rota padrão
<SW> display ip routing-table 0.0.0.0
```

---

## Ping e Traceroute

```bash
# Ping simples
<SW> ping 8.8.8.8

# Ping com tamanho de pacote e contagem customizados
<SW> ping -s 1400 -c 100 192.168.1.1

# Ping com source específico (útil para testar VLANIFs)
<SW> ping -a 10.255.1.1 192.168.100.1

# Traceroute
<SW> tracert 8.8.8.8

# Traceroute com source específico
<SW> tracert -a 10.255.1.1 10.255.2.2
```

---

## OSPF

```bash
# Estado dos vizinhos (esperado: FULL)
<SW> display ospf peer
<SW> display ospf peer brief

# Rotas aprendidas via OSPF
<SW> display ospf routing

# Base de dados OSPF (LSDB)
<SW> display ospf lsdb

# Interfaces participando do OSPF
<SW> display ospf interface
```

---

## BGP

```bash
# Estado dos peers BGP
<SW> display bgp peer

# Tabela de roteamento BGP completa
<SW> display bgp routing-table

# Rotas recebidas de um peer específico
<SW> display bgp routing-table peer 10.0.0.1 received-routes

# Rotas anunciadas para um peer específico
<SW> display bgp routing-table peer 10.0.0.1 advertised-routes
```

---

## MPLS / LDP

```bash
# Todos os LSPs ativos
<SW> display mpls lsp

# Sessões LDP (esperado: Operational)
<SW> display mpls ldp session

# Peers LDP descobertos
<SW> display mpls ldp peer

# Interfaces com MPLS/LDP habilitado
<SW> display mpls ldp interface

# Ping no plano MPLS (teste de LSP)
<SW> ping mpls ldp ip 10.255.2.2 32
<SW> ping mpls te tunnel 1

# Traceroute MPLS
<SW> tracert mpls ldp ip 10.255.2.2 32
```

---

## L2VPN / VPLS

```bash
# Estado dos VSIs (Virtual Switch Instance)
<SW> display vsi verbose

# Estado dos pseudowires
<SW> display l2vpn pw verbose
<SW> display mpls l2vc

# Ping no pseudowire
<SW> ping mpls l2vc 10.255.2.2 100 vlan
```

---

## MAC e ARP

```bash
# Tabela MAC completa
<SW> display mac-address

# MAC de uma interface específica
<SW> display mac-address GigabitEthernet 0/0/1

# Tabela ARP completa
<SW> display arp

# ARP de um IP específico
<SW> display arp 192.168.1.1
```

---

## STP (Spanning Tree)

```bash
# Resumo do estado STP por interface
<SW> display stp brief

# Detalhe do STP em uma interface
<SW> display stp interface GigabitEthernet 0/0/1
```

---

## Logs e Alarmes

```bash
# Visualizar logs recentes
<SW> display logbuffer

# Ver alarmes ativos
<SW> display alarm active

# Histórico de erros de interface
<SW> display interface GigabitEthernet 0/0/1 | include Error
```

---

## Debug (usar com cautela)

```bash
# Debug OSPF
<SW> debugging ospf event

# Debug BGP
<SW> debugging bgp all

# Debug LDP
<SW> debugging mpls ldp all

# Desabilitar todos os debugs (SEMPRE ao finalizar)
<SW> undo debugging all
```

---

## Veja Também

- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [VLAN e Interfaces — Switch Huawei](./vlan)
- [MPLS / LDP — Switch Huawei](./mpls)
- [MPLS L2VPN / VPLS — Switch Huawei](./mpls-l2vpn)
- [Gerência e SSH — Switch Huawei](./gerencia-ssh)
