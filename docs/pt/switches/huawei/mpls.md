---
description: Configuração de MPLS, LDP e MPLS-TE em switches Huawei CloudEngine — LSR-ID, habilitação por interface e túneis TE.
---

# MPLS / LDP — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de MPLS com LDP em switches Huawei. Cobre habilitação global, ativação por interface (física e VLANIF), integração com OSPF e configuração básica de MPLS-TE para engenharia de tráfego.

::: warning Pré-requisito
OSPF (ou outro IGP) deve estar configurado e com as adjacências estabelecidas antes de habilitar MPLS/LDP. O LSR-ID deve ser o endereço da interface Loopback 0.
:::

---

## Habilitar MPLS Globalmente

```bash
# 1. Configurar loopback (LSR-ID)
[SW] interface LoopBack 0
[SW-LoopBack0] ip address 10.255.1.1 255.255.255.255
[SW-LoopBack0] quit

# 2. Definir LSR-ID
[SW] mpls lsr-id 10.255.1.1

# 3. Habilitar MPLS global
[SW] mpls
[SW-mpls] lsp-trigger host
[SW-mpls] quit

# 4. Habilitar LDP global
[SW] mpls ldp
[SW-mpls-ldp] quit
```

---

## Habilitar MPLS por Interface

### Interface física

```bash
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] mpls
[SW-GE0/0/1] mpls ldp
[SW-GE0/0/1] quit
```

### Interface VLANIF

```bash
[SW] interface Vlanif 100
[SW-Vlanif100] mpls
[SW-Vlanif100] mpls ldp
[SW-Vlanif100] quit
```

---

## OSPF como IGP para MPLS

OSPF distribui os prefixos de loopback que o LDP usa para montar os LSPs.

```bash
[SW] ospf 1 router-id 10.255.1.1
[SW-ospf-1] area 0
[SW-ospf-1-area-0.0.0.0] network 10.255.1.1 0.0.0.0
[SW-ospf-1-area-0.0.0.0] network 10.1.1.0 0.0.0.3
[SW-ospf-1-area-0.0.0.0] quit
[SW-ospf-1] quit
```

---

## MPLS-TE (Traffic Engineering)

MPLS-TE permite reservar banda e definir caminhos explícitos para tráfego crítico.

### Habilitar MPLS-TE

```bash
# Habilitar TE e RSVP globalmente
[SW] mpls
[SW-mpls] mpls te
[SW-mpls] mpls rsvp-te
[SW-mpls] quit

# Habilitar TE por interface
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] mpls te
[SW-GE0/0/1] quit

# Habilitar OSPF com suporte a TE (Opaque LSA)
[SW] ospf 1
[SW-ospf-1] opaque-capability enable
[SW-ospf-1] area 0
[SW-ospf-1-area-0.0.0.0] mpls-te enable
[SW-ospf-1-area-0.0.0.0] quit
[SW-ospf-1] quit
```

### Criar Túnel MPLS-TE

```bash
[SW] interface Tunnel 1
[SW-Tunnel1] ip address unnumbered interface LoopBack 0
[SW-Tunnel1] tunnel-protocol mpls te
[SW-Tunnel1] destination 10.255.2.2
[SW-Tunnel1] mpls te bandwidth ct0 100000
[SW-Tunnel1] mpls te record-route
[SW-Tunnel1] quit
```

---

## Verificar MPLS

```bash
# Ver todos os LSPs ativos
<SW> display mpls lsp

# Sessões LDP estabelecidas
<SW> display mpls ldp session

# LSPs aprendidos via LDP
<SW> display mpls ldp lsp

# Túneis TE ativos
<SW> display mpls te tunnel

# Informações de TE do OSPF
<SW> display ospf mpls-te

# Verificar interface LDP
<SW> display mpls ldp interface
```

---

## Problemas Comuns

### Sessão LDP não estabelece

```bash
# 1. Verificar se MPLS está habilitado na interface
<SW> display mpls ldp interface

# 2. Verificar se o vizinho é alcançável via IGP
<SW> display ospf peer brief
<SW> ping 10.255.2.2

# 3. Verificar se o LSR-ID está correto
<SW> display mpls lsr-id

# 4. Conferir o estado da sessão LDP
<SW> display mpls ldp session
# Esperado: "Operational" — se "Nonexistent", verificar conectividade e MPLS na interface
```

### LSP não formado para um destino

```bash
# Verificar se a rota existe no IGP
<SW> display ospf routing

# Verificar se o trigger está correto (host = apenas /32)
<SW> display mpls lsp
# Se falta LSP para um prefixo, checar lsp-trigger:
[SW] mpls
[SW-mpls] lsp-trigger all   # alternativa ao "host"
[SW-mpls] quit
```

### Ping MPLS LSP falha

```bash
# Teste de conectividade no plano MPLS
<SW> ping mpls ldp ip 10.255.2.2 32

# Traceroute pelo caminho MPLS
<SW> tracert mpls ldp ip 10.255.2.2 32
```

---

## Veja Também

- [MPLS L2VPN / VPLS — Switch Huawei](./mpls-l2vpn)
- [VLAN e Interfaces — Switch Huawei](./vlan)
- [Troubleshooting — Switch Huawei](./troubleshooting)
- [MPLS — Roteador Huawei](/pt/roteadores/huawei/ospf)
