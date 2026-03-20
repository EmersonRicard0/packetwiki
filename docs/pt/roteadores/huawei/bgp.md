---
description: Configuração de BGP no roteador Huawei NE — eBGP, iBGP, Route-Reflector, route-policy, local-preference e VPNv4.
---

# BGP — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Guia de configuração de BGP em roteadores Huawei NE. Cobre eBGP para upstream/transit, iBGP entre PEs, Route-Reflector, filtros com route-policy e prefix-list, ajuste de atributos e base de VPNv4 para MPLS L3VPN.

::: warning Modelo candidato/commit
Todas as alterações no NE exigem `commit` explícito para entrar em vigor. Use `display configuration candidate` para revisar antes de confirmar.
:::

---

## Configuração Básica eBGP

Sessão eBGP com provedor de trânsito (AS diferente):

```bash
[PE01] bgp 65001
[PE01-bgp] router-id 10.255.1.1
[PE01-bgp] peer 200.100.1.1 as-number 65002
[PE01-bgp] peer 200.100.1.1 description TRANSIT-OPERADORA
[PE01-bgp] ipv4-family unicast
[PE01-bgp-af-ipv4] peer 200.100.1.1 enable
[PE01-bgp-af-ipv4] quit
[PE01-bgp] quit
[PE01] commit
```

---

## iBGP entre PEs

Sessão iBGP usando loopbacks (mesmo AS). O `next-hop-local` garante que o next-hop seja atualizável pelos clientes.

```bash
[PE01] bgp 65001
[PE01-bgp] peer 10.255.2.2 as-number 65001
[PE01-bgp] peer 10.255.2.2 connect-interface LoopBack 0
[PE01-bgp] ipv4-family unicast
[PE01-bgp-af-ipv4] peer 10.255.2.2 enable
[PE01-bgp-af-ipv4] peer 10.255.2.2 next-hop-local
[PE01-bgp-af-ipv4] quit
[PE01-bgp] quit
[PE01] commit
```

---

## BGP com Route-Reflector

O Route-Reflector (RR) elimina a necessidade de full-mesh iBGP. Configure `reflect-client` apenas no RR para cada cliente.

```bash
# No Route-Reflector (RR):
[RR] bgp 65001
[RR-bgp] peer 10.255.1.1 as-number 65001
[RR-bgp] peer 10.255.1.1 connect-interface LoopBack 0
[RR-bgp] ipv4-family unicast
[RR-bgp-af-ipv4] peer 10.255.1.1 enable
[RR-bgp-af-ipv4] peer 10.255.1.1 reflect-client
[RR-bgp-af-ipv4] quit
[RR-bgp] quit
[RR] commit
```

---

## Route-Policy (Filtro de Rotas)

### Criar prefix-list e aplicar como filtro de exportação

```bash
# Permitir apenas prefixos /24 a /32 dentro de 10.0.0.0/8
[PE01] ip ip-prefix ALLOW-PREFIX index 10 permit 10.0.0.0 8 greater-equal 24 less-equal 32

# Criar route-policy que usa o prefix-list
[PE01] route-policy EXPORT-TO-TRANSIT permit node 10
[PE01-route-policy] if-match ip-prefix ALLOW-PREFIX
[PE01-route-policy] quit

# Aplicar no peer de saída
[PE01] bgp 65001
[PE01-bgp] ipv4-family unicast
[PE01-bgp-af-ipv4] peer 200.100.1.1 route-policy EXPORT-TO-TRANSIT export
[PE01-bgp-af-ipv4] quit
[PE01-bgp] quit
[PE01] commit
```

### Negar tudo que não foi permitido explicitamente

```bash
# Nó final de deny implícito (boa prática: criar explicitamente)
[PE01] route-policy EXPORT-TO-TRANSIT deny node 100
[PE01-route-policy] quit
[PE01] commit
```

---

## Local Preference

Usado para influenciar saída de tráfego no iBGP: maior valor = preferido.

```bash
[PE01] route-policy SET-LOCAL-PREF permit node 10
[PE01-route-policy] apply local-preference 200
[PE01-route-policy] quit

[PE01] bgp 65001
[PE01-bgp] ipv4-family unicast
[PE01-bgp-af-ipv4] peer 10.255.2.2 route-policy SET-LOCAL-PREF import
[PE01-bgp-af-ipv4] quit
[PE01-bgp] quit
[PE01] commit
```

---

## MED (Multi-Exit Discriminator)

Usado para influenciar entrada de tráfego no eBGP: menor valor = preferido.

```bash
[PE01] route-policy SET-MED permit node 10
[PE01-route-policy] apply cost 100
[PE01-route-policy] quit

[PE01] bgp 65001
[PE01-bgp] ipv4-family unicast
[PE01-bgp-af-ipv4] peer 200.100.1.1 route-policy SET-MED export
[PE01-bgp-af-ipv4] quit
[PE01-bgp] quit
[PE01] commit
```

---

## BGP para VPNv4 (MPLS L3VPN)

Habilita a troca de rotas VPNv4 entre PEs para serviços de MPLS L3VPN.

```bash
[PE01] bgp 65001
[PE01-bgp] peer 10.255.2.2 as-number 65001
[PE01-bgp] peer 10.255.2.2 connect-interface LoopBack 0
[PE01-bgp] ipv4-family vpnv4
[PE01-bgp-af-vpnv4] peer 10.255.2.2 enable
[PE01-bgp-af-vpnv4] quit
[PE01-bgp] quit
[PE01] commit
```

---

## Verificar BGP

```bash
# Estado dos peers (esperado: Established)
<PE01> display bgp peer

# Tabela BGP completa
<PE01> display bgp routing-table

# Rotas recebidas de um peer
<PE01> display bgp routing-table peer 200.100.1.1 received-routes

# Rotas anunciadas para um peer
<PE01> display bgp routing-table peer 200.100.1.1 advertised-routes

# Detalhes de um prefixo específico
<PE01> display bgp routing-table 10.0.0.0

# Estatísticas resumidas
<PE01> display bgp routing-table statistics
```

---

## Reset de Sessão BGP

```bash
# Reset completo (derruba e reconecta a sessão)
<PE01> reset bgp 200.100.1.1

# Soft reset — reaplicar políticas sem derrubar a sessão
<PE01> refresh bgp 200.100.1.1 import
<PE01> refresh bgp 200.100.1.1 export
```

---

## Problemas Comuns

### Peer BGP não estabelece (estado Idle/Active)

```bash
# 1. Verificar conectividade básica
<PE01> ping -a 10.255.1.1 200.100.1.1

# 2. Confirmar AS number e IP do peer
<PE01> display bgp peer

# 3. Verificar se a interface de origem está UP
<PE01> display interface LoopBack 0

# 4. Confirmar que o commit foi feito
[PE01] display configuration candidate
```

### Rotas não aparecem na tabela BGP

```bash
# Verificar se o peer está Established
<PE01> display bgp peer

# Verificar filtros aplicados
<PE01> display bgp routing-table peer 200.100.1.1 received-routes

# Verificar route-policy ativa
<PE01> display route-policy
```

### Rotas BGP não entram na tabela de roteamento

```bash
# Verificar preferência local (BGP tem preferência baixa por padrão)
<PE01> display ip routing-table 10.0.0.0 verbose

# Comparar com rotas do IGP pelo mesmo prefixo
<PE01> display ospf routing
```

---

## Veja Também

- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [OSPF — Roteador Huawei](./ospf)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [BGP no RouterOS — MikroTik](/pt/roteadores/mikrotik/bgp)
