---
description: Configuração de QoS e controle de banda no roteador Huawei NE — Traffic Classifier, Traffic Behavior, CAR, DSCP remarking e UCL para BNG.
---

# Controle de Banda (QoS) — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Guia de configuração de QoS (Quality of Service) em roteadores Huawei NE usando o modelo MQC (Modular QoS CLI). Cobre limitação de banda por CAR, remarque de DSCP e controle de usuários PPPoE por UCL para ambientes BNG.

## Visão Geral

O VRP utiliza o modelo MQC (Modular QoS CLI):
1. **Traffic Classifier** — identifica o tráfego
2. **Traffic Behavior** — define a ação
3. **Traffic Policy** — une e aplica na interface

## ACL para Classificação

```bash
[PE01] acl 3100
[PE01-acl-adv-3100] rule 5 permit ip source 192.168.0.0 0.0.255.255
[PE01-acl-adv-3100] quit
```

## Criar Classifier

```bash
[PE01] traffic classifier CL-CLIENTE
[PE01-classifier-CL-CLIENTE] if-match acl 3100
[PE01-classifier-CL-CLIENTE] quit
```

## Criar Behavior — CAR (Limite de Banda)

```bash
# Limitar a 100 Mbps
[PE01] traffic behavior BH-100M
[PE01-behavior-BH-100M] car cir 100000 cbs 6000000 pbs 12000000 green pass yellow pass red discard
[PE01-behavior-BH-100M] quit
```

## Criar Traffic Policy

```bash
[PE01] traffic policy POL-CLIENTES
[PE01-trafficpolicy-POL-CLIENTES] classifier CL-CLIENTE behavior BH-100M
[PE01-trafficpolicy-POL-CLIENTES] quit

# Aplicar na interface
[PE01] interface GigabitEthernet 1/0/0
[PE01-GE1/0/0] traffic-policy POL-CLIENTES inbound
[PE01-GE1/0/0] quit
[PE01] commit
```

## UCL (User-based Control List) para BNG

```bash
# Criar grupo de usuário
[PE01] user-group PLAN-100M
[PE01-user-group-PLAN-100M] quit

# Aplicar CAR ao grupo no domínio PPPoE
[PE01] aaa
[PE01-aaa] domain ISP-CLIENTES
[PE01-aaa-domain-ISP-CLIENTES] user-group PLAN-100M
[PE01-aaa-domain-ISP-CLIENTES] quit
[PE01-aaa] quit
[PE01] commit
```

## DSCP Remarking

```bash
[PE01] traffic behavior BH-REMARK-EF
[PE01-behavior-BH-REMARK-EF] remark dscp ef
[PE01-behavior-BH-REMARK-EF] quit
```

## Verificar QoS

```bash
<PE01> display traffic policy statistics interface GigabitEthernet 1/0/0 inbound
<PE01> display traffic classifier user-defined
<PE01> display traffic behavior user-defined
<PE01> display traffic policy user-defined
```

---

## Veja Também

- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [BGP — Roteador Huawei](./bgp)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [Controle de Banda — Switch Huawei](/pt/switches/huawei/controle-de-banda)
