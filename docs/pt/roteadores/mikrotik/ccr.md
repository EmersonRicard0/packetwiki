---
description: Guia completo do MikroTik CCR — Cloud Core Router para ISPs. PPPoE, BGP, monitoramento e troubleshooting com RouterOS 6.x e 7.x.
---

# MikroTik CCR — Cloud Core Router

::: tip Versão testada
RouterOS **7.11** (CCR2xxx) e **6.49.x** (CCR1xxx). Comandos da série 6.x e 7.x indicados onde diferem.
:::

Os roteadores da série **CCR (Cloud Core Router)** são os equipamentos de alto desempenho da MikroTik, desenvolvidos especialmente para ISPs, data centers e ambientes que exigem alto throughput.

## Modelos da Série CCR

| Modelo | Núcleos | RAM | Portas | Indicado para |
|--------|---------|-----|--------|---------------|
| CCR1009-7G-1C-1S+ | 9 (700MHz) | 2GB | 7x GbE + 1x combo + 1x SFP+ | ISP pequeno/médio |
| CCR1036-8G-2S+ | 36 (1.2GHz) | 4GB | 8x GbE + 2x SFP+ | ISP médio |
| CCR1072-1G-8S+ | 72 (1GHz) | 16GB | 1x GbE + 8x SFP+ | ISP grande / DC |
| CCR2004-1G-12S+2XS | 4 (1.7GHz ARM) | 4GB | 1x GbE + 12x SFP+ + 2x 25G | ISP médio/grande |
| CCR2116-12G-4S+ | 16 (2GHz ARM) | 16GB | 12x GbE + 4x SFP+ | ISP grande |

## Características Gerais

- RouterOS com licença **Level 6** (recursos ilimitados)
- Suporte a **BGP, OSPF, IS-IS, MPLS, VRF**
- Hardware offload para roteamento e firewall em modelos ARM
- Dual power supply em modelos enterprise
- Rack mount 1U

## Configuração Básica de ISP (PPPOE Server)

Cenário típico: CCR como concentrador PPPoE com VLANs por bairro.

### 1. Criar VLANs nas interfaces

```bash
# Criar VLANs para cada segmento
/interface vlan add name=vlan100-bairro-a vlan-id=100 interface=ether1
/interface vlan add name=vlan200-bairro-b vlan-id=200 interface=ether1
```

### 2. Criar Pool de IPs para os clientes

```bash
/ip pool add name=pool-pppoe-clientes ranges=10.0.0.2-10.0.0.254
```

### 3. Criar Profile PPPoE

```bash
/ppp profile add \
  name=perfil-residencial \
  local-address=10.0.0.1 \
  remote-address=pool-pppoe-clientes \
  rate-limit=10M/10M \
  dns-server=8.8.8.8,1.1.1.1
```

### 4. Criar servidor PPPoE

```bash
/interface pppoe-server server add \
  service-name=packetwiki-isp \
  interface=vlan100-bairro-a \
  default-profile=perfil-residencial \
  authentication=chap,pap \
  disabled=no
```

### 5. Adicionar usuários PPPoE

```bash
/ppp secret add \
  name=cliente001 \
  password=senha123 \
  profile=perfil-residencial \
  service=pppoe
```

## BGP — Configuração Básica

```bash
# Definir AS e Router ID
/routing bgp instance set default as=65001 router-id=1.2.3.4

# Adicionar peer (upstream provider)
/routing bgp peer add \
  name=upstream-provider \
  remote-address=1.2.3.1 \
  remote-as=65000 \
  ttl=1

# Anunciar prefixo próprio
/routing bgp network add network=200.200.200.0/24
```

## Monitoramento de Performance

```bash
# Ver uso de CPU por core
/system resource print

# Ver throughput em tempo real por interface
/interface monitor-traffic ether1 interval=1

# Ver conexões ativas
/ip firewall connection print count-only

# Histórico de recursos
/system resource history print
```

## Troubleshooting Comum

### Alto uso de CPU

```bash
# Ver processos que mais consomem CPU
/tool profile

# Verificar se o hardware offload está ativo
/ip settings print
# fastpath-active: yes  <- indica offload ativo
```

### BGP não estabelece sessão

```bash
# Ver status das sessões BGP
/routing bgp peer print status

# Ver log de eventos BGP
/log print where topics~"bgp"
```

## Referência Rápida

| Função | Comando |
|--------|---------|
| Ver rotas BGP | `/routing bgp advertisements print` |
| Ver tabela de rotas | `/ip route print` |
| Ver conexões PPPoE ativas | `/ppp active print` |
| Reiniciar interface | `/interface disable/enable ether1` |
| Ver ARP table | `/ip arp print` |
| Sniff de pacotes | `/tool sniffer quick interface=ether1` |

## Veja Também

- [BGP no RouterOS](/pt/roteadores/mikrotik/bgp) — sessões eBGP/iBGP, filtros, communities
- [OSPF no RouterOS](/pt/roteadores/mikrotik/ospf) — IGP para backbone de ISP
- [MikroTik hEX Series](/pt/roteadores/mikrotik/hex-series)
- [MikroTik RB4011](/pt/roteadores/mikrotik/rb4011)
