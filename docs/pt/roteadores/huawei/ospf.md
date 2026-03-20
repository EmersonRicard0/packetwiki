---
description: Configuração de OSPF no roteador Huawei NE — instância, áreas, interfaces, redistribuição e troubleshooting.
---

# OSPF — Roteador Huawei NE

::: tip Versão testada
VRP **V200R021C10** (NE40E / NE8000). Compatível com V200R019+.
:::

OSPF é o protocolo IGP padrão em backbones Huawei. Distribui as rotas internas entre os roteadores PE e P, sendo base para o funcionamento do MPLS LDP.

---

## Configuração Básica

### 1. Criar processo OSPF

```bash
[PE01] ospf 1 router-id 10.255.0.1
[PE01-ospf-1] area 0
[PE01-ospf-1-area-0.0.0.0] quit
[PE01-ospf-1] quit
```

### 2. Habilitar OSPF nas interfaces

```bash
# Interface de backbone (link entre roteadores)
[PE01] interface GigabitEthernet0/0/0
[PE01-GigabitEthernet0/0/0] ospf enable 1 area 0
[PE01-GigabitEthernet0/0/0] ospf network-type p2p
[PE01-GigabitEthernet0/0/0] quit

# Loopback — sempre passiva, anunciada como host route
[PE01] interface LoopBack0
[PE01-LoopBack0] ospf enable 1 area 0
[PE01-LoopBack0] quit
```

::: tip
Use sempre `ospf network-type p2p` em links ponto-a-ponto — evita eleição de DR/BDR e acelera a convergência.
:::

---

## Ajustes de Timer

```bash
# Hello/Dead reduzidos para convergência mais rápida
[PE01-GigabitEthernet0/0/0] ospf timer hello 5
[PE01-GigabitEthernet0/0/0] ospf timer dead 20

# BFD para detecção rápida de falha (subsegundo)
[PE01-GigabitEthernet0/0/0] ospf bfd enable
```

---

## Autenticação MD5

```bash
[PE01] ospf 1
[PE01-ospf-1] area 0
[PE01-ospf-1-area-0.0.0.0] authentication-mode md5 1 cipher SenhaOspf@2024
[PE01-ospf-1-area-0.0.0.0] quit
```

---

## Redistribuição de Rotas

```bash
# Redistribuir rotas estáticas no OSPF (ex: bloco de clientes)
[PE01] ospf 1
[PE01-ospf-1] import-route static cost 100 type 2
[PE01-ospf-1] quit

# Redistribuir rotas BGP (cuidado — pode causar route leaking)
[PE01-ospf-1] import-route bgp cost 200 type 2
```

---

## OSPF como base para MPLS LDP

```bash
# LDP usa o OSPF para calcular caminhos — habilitar nas mesmas interfaces
[PE01] mpls
[PE01-mpls] lsr-id 10.255.0.1
[PE01-mpls] quit

[PE01] mpls ldp
[PE01-mpls-ldp] quit

[PE01] interface GigabitEthernet0/0/0
[PE01-GigabitEthernet0/0/0] mpls
[PE01-GigabitEthernet0/0/0] mpls ldp
[PE01-GigabitEthernet0/0/0] quit
```

---

## Verificação

```bash
# Ver vizinhos OSPF
<PE01> display ospf peer

# Ver tabela LSDB
<PE01> display ospf lsdb

# Ver rotas aprendidas via OSPF
<PE01> display ip routing-table protocol ospf

# Ver interfaces OSPF
<PE01> display ospf interface

# Ver configuração do processo
<PE01> display ospf 1
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver vizinhos | `display ospf peer` |
| Ver rotas OSPF | `display ip routing-table protocol ospf` |
| Ver LSDB | `display ospf lsdb` |
| Ver interfaces | `display ospf interface` |
| Ver erros | `display ospf error` |

---

## Problemas Comuns

### Adjacência não sobe

```bash
# Verificar timers — devem ser iguais nos dois lados
<PE01> display ospf interface GigabitEthernet0/0/0

# Verificar se a autenticação está configurada nos dois lados
<PE01> display ospf peer verbose

# Verificar se o network-type é igual nos dois lados
# p2p de um lado e broadcast do outro = adjacência não sobe
```

### Rota não aparece na tabela

```bash
# Verificar se a redistribuição está ativa
<PE01> display ospf 1 brief

# Verificar se há filtro de rota aplicado
<PE01> display ospf asbr-summary
```

---

## Veja Também

- [BGP — Roteador Huawei](/pt/roteadores/huawei/bgp)
- [Configuração Inicial — Roteador Huawei](/pt/roteadores/huawei/configuracao-inicial)
- [MPLS — Switch Huawei](/pt/switches/huawei/mpls)
- [OSPF no RouterOS MikroTik](/pt/roteadores/mikrotik/ospf)
