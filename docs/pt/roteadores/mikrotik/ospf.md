---
description: Configuração de OSPF no MikroTik RouterOS — áreas, interfaces, redistribuição de rotas e troubleshooting.
---

# OSPF no RouterOS — MikroTik

::: tip Versão testada
RouterOS **7.x** (CCR2xxx, RB4011) e **6.49.x** (CCR1xxx). O OSPF v2 cobre redes IPv4; OSPFv3 para IPv6 segue a mesma lógica.
:::

O OSPF é o protocolo IGP mais usado em redes de ISP no Brasil, distribuindo as rotas internas entre os roteadores de backbone e borda.

---

## Configuração Básica

### 1. Criar instância OSPF

```bash
# RouterOS 7.x
/routing ospf instance add \
  name=ospf-backbone \
  version=2 \
  router-id=10.255.0.1

# RouterOS 6.x
/routing ospf instance set default \
  router-id=10.255.0.1
```

### 2. Criar área

```bash
# Area backbone (0.0.0.0) — obrigatória
/routing ospf area add \
  name=backbone \
  area-id=0.0.0.0 \
  instance=ospf-backbone

# Area de stub (opcional)
/routing ospf area add \
  name=area-filial \
  area-id=0.0.0.1 \
  type=stub \
  instance=ospf-backbone
```

### 3. Adicionar interfaces

```bash
# Interface de backbone (link entre roteadores ISP)
/routing ospf interface-template add \
  interfaces=ether1 \
  area=backbone \
  type=ptp \
  cost=10 \
  hello-interval=10s \
  dead-interval=40s

# Loopback (para redistribuir no OSPF)
/routing ospf interface-template add \
  interfaces=lo0 \
  area=backbone \
  type=ptp \
  passive
```

::: tip
Sempre inclua o **loopback** como interface passiva no OSPF — é ele que serve como Router-ID e endereço de origem para sessões BGP/MPLS.
:::

---

## Tipos de Interface OSPF

| Tipo | Quando usar | Comportamento |
|------|-------------|---------------|
| `broadcast` | Ethernet com vários roteadores | Elege DR/BDR |
| `ptp` (point-to-point) | Links dedicados ou VLANs P2P | Sem eleição DR/BDR |
| `ptmp` | Links multiponto | Sem eleição DR/BDR |
| `passive` | Loopbacks, redes de usuário | Anuncia mas não forma adjacência |

```bash
# Mudar tipo de uma interface para ptp (recomendado em ISP)
/routing ospf interface-template set [find interfaces=ether2] type=ptp
```

---

## Redistribuição de Rotas

### Redistribuir rotas estáticas no OSPF

```bash
/routing ospf instance set ospf-backbone \
  redistribute=static,connected
```

### Redistribuir prefixo específico com filtro

```bash
# Criar filtro para redistribuir só o bloco do ISP
/routing filter rule add \
  chain=ospf-redistribute \
  rule="if (dst == 200.200.200.0/24) { accept } else { reject }"

/routing ospf instance set ospf-backbone \
  out-filter=ospf-redistribute
```

---

## Autenticação entre Vizinhos

```bash
# Autenticação MD5 na interface (recomendado em produção)
/routing ospf interface-template set [find interfaces=ether1] \
  auth=md5 \
  auth-key=SenhaOspfForte2024
```

---

## Monitoramento e Verificação

```bash
# Ver vizinhos OSPF
/routing ospf neighbor print

# Ver estado das adjacências
/routing ospf neighbor print detail

# Ver LSDB (Link State Database)
/routing ospf lsa print

# Ver rotas aprendidas via OSPF
/routing route print where ospf

# Ver instâncias e áreas
/routing ospf instance print
/routing ospf area print
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver vizinhos | `/routing ospf neighbor print` |
| Ver rotas OSPF | `/routing route print where ospf` |
| Ver LSDB | `/routing ospf lsa print` |
| Ver interfaces OSPF | `/routing ospf interface print` |
| Limpar adjacências | `/routing ospf neighbor` → reset |

---

## Problemas Comuns

### Adjacência não sobe (stuck em Init/2-Way)

```bash
# Verificar hello/dead intervals — devem ser iguais nos dois lados
/routing ospf interface print detail

# Verificar se os IPs estão na mesma subnet
/ip address print

# Verificar se firewall está bloqueando protocolo OSPF (89)
/ip firewall filter print where protocol=ospf
```

### Rotas OSPF somem da tabela

```bash
# Verificar se a adjacência caiu
/routing ospf neighbor print

# Ver log de eventos OSPF
/log print where topics~"ospf"
```

### Router-ID duplicado na rede

```bash
# Verificar Router-ID de todos os roteadores
/routing ospf instance print
# Cada roteador DEVE ter um Router-ID único
```

---

## Veja Também

- [BGP no RouterOS](/pt/roteadores/mikrotik/bgp)
- [CCR — Cloud Core Router](/pt/roteadores/mikrotik/ccr)
- [MPLS — Switches Huawei](/pt/switches/huawei/mpls)
