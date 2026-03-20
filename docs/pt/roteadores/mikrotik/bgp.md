---
description: Configuração completa de BGP no MikroTik RouterOS — sessões iBGP/eBGP, filtros, communities e monitoramento.
---

# BGP no RouterOS — MikroTik

::: tip Versão testada
RouterOS **7.x** (CCR2xxx, RB4011) e **6.49.x** (CCR1xxx). Os comandos são compatíveis com ambas as versões, com diferenças indicadas onde existirem.
:::

O BGP no RouterOS é robusto e amplamente usado em ISPs brasileiros para troca de rotas com upstreams, IXPs (como PTT.br) e peers privados.

---

## Configuração Básica — eBGP com Upstream

### 1. Definir AS e Router-ID

```bash
# RouterOS 7.x
/routing bgp template
set default as=65001 router-id=200.200.200.1

# RouterOS 6.x
/routing bgp instance
set default as=65001 router-id=200.200.200.1
```

### 2. Adicionar peer (upstream provider)

```bash
# RouterOS 7.x
/routing bgp connection add \
  name=upstream-fibra \
  remote.address=1.2.3.1 \
  remote.as=65000 \
  local.role=ebgp \
  hold-time=90 \
  keepalive-time=30 \
  disabled=no

# RouterOS 6.x
/routing bgp peer add \
  name=upstream-fibra \
  remote-address=1.2.3.1 \
  remote-as=65000 \
  ttl=1 \
  hold-time=1m30s \
  keepalive-time=30s
```

### 3. Anunciar prefixo próprio

```bash
# Anunciar bloco IP do ISP
/routing bgp network add \
  network=200.200.200.0/24 \
  synchronize=no
```

---

## iBGP entre Roteadores do ISP

```bash
# Peer iBGP interno (mesmo AS)
/routing bgp connection add \
  name=ibgp-pe02 \
  remote.address=10.0.0.2 \
  remote.as=65001 \
  local.role=ibgp \
  multihop=yes \
  update-source=lo0
```

::: tip
Em iBGP, use sempre o **loopback** como source para estabilidade da sessão.
:::

---

## Filtros de Rota (Route Filters)

### Bloquear prefixos inválidos do peer

```bash
# Criar lista de prefixos inválidos (bogons / very specifics)
/routing filter rule add \
  chain=bgp-in-upstream \
  rule="if (dst-len > 24) { reject }"

/routing filter rule add \
  chain=bgp-in-upstream \
  rule="if (dst in 10.0.0.0/8 || dst in 192.168.0.0/16 || dst in 172.16.0.0/12) { reject }"

/routing filter rule add \
  chain=bgp-in-upstream \
  rule="accept"
```

### Aplicar filtro no peer

```bash
/routing bgp connection set upstream-fibra \
  input.filter=bgp-in-upstream \
  output.filter=bgp-out-upstream
```

---

## BGP Communities

```bash
# Marcar rotas com community ao anunciar
/routing filter rule add \
  chain=bgp-out-upstream \
  rule="set bgp-communities 65000:100; accept"

# Filtrar por community na entrada
/routing filter rule add \
  chain=bgp-in-upstream \
  rule="if (bgp-communities has 65000:666) { reject }"
```

---

## Local Preference (iBGP)

```bash
# Preferir um uplink sobre outro
/routing filter rule add \
  chain=bgp-in-upstream-principal \
  rule="set bgp-local-pref 200; accept"

/routing filter rule add \
  chain=bgp-in-upstream-backup \
  rule="set bgp-local-pref 100; accept"
```

---

## Monitoramento e Verificação

```bash
# Ver status das sessões
/routing bgp session print

# Ver tabela de rotas BGP
/routing route print where bgp

# Ver rotas anunciadas para um peer
/routing bgp advertisement print

# Ver atributos de uma rota específica
/routing route print detail where dst-address=1.2.3.0/24

# Log de eventos BGP
/log print where topics~"bgp"

# Contar prefixos recebidos
/routing route print count-only where bgp
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver sessões ativas | `/routing bgp session print` |
| Derrubar e reestabelecer sessão | `/routing bgp session reset` |
| Ver tabela BGP | `/routing route print where bgp` |
| Ver anúncios para peer | `/routing bgp advertisement print` |
| Ver log BGP | `/log print where topics~"bgp"` |

---

## Problemas Comuns

### Sessão não sobe (Active/Connect)

```bash
# Verificar conectividade com o peer
/ping 1.2.3.1 count=5

# Verificar se a porta 179 está aberta
/tool telnet 1.2.3.1 179

# Verificar regras de firewall bloqueando BGP
/ip firewall filter print where dst-port=179
```

### Prefixos não aparecem na tabela de rotas

```bash
# Verificar se os filtros estão rejeitando
/log print where topics~"bgp" && topics~"filter"

# Desabilitar filtro temporariamente pra testar
/routing bgp connection set upstream-fibra input.filter=""
```

### Sessão flapping (caindo e subindo)

```bash
# Verificar hold-time — deve ser no mínimo 3x o keepalive
/routing bgp connection print detail

# Verificar uso de CPU durante o flap
/system resource monitor
```

---

## Veja Também

- [CCR — Cloud Core Router](/pt/roteadores/mikrotik/ccr)
- [OSPF no RouterOS](/pt/roteadores/mikrotik/ospf)
- [BGP Huawei NE](/pt/roteadores/huawei/bgp)
