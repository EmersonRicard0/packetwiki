---
description: Configuração de QoS e controle de banda em switches Huawei — Traffic Classifier, Traffic Behavior, CAR, remarcar DSCP, WFQ e Storm Control.
---

# Controle de Banda (QoS) — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de QoS (Quality of Service) em switches Huawei. O modelo Huawei usa três objetos encadeados: **Traffic Classifier** (identifica o tráfego) → **Traffic Behavior** (define a ação) → **Traffic Policy** (une os dois e aplica na interface).

---

## Conceitos

| Objeto | Função |
|--------|--------|
| **Traffic Classifier** | Identifica o tráfego por ACL, DSCP, VLAN, IP |
| **Traffic Behavior** | Define a ação: limitar (CAR), remarcar DSCP, descartar |
| **Traffic Policy** | Une Classifier + Behavior e aplica em uma interface |

---

## ACL para Classificação

```bash
# ACL avançada para identificar tráfego de uma sub-rede
[SW] acl 3001
[SW-acl-adv-3001] rule 5 permit ip source 192.168.1.0 0.0.0.255 destination any
[SW-acl-adv-3001] quit
```

---

## Criar Traffic Classifier

```bash
[SW] traffic classifier CLASS-CLIENTE operator or
[SW-classifier-CLASS-CLIENTE] if-match acl 3001
[SW-classifier-CLASS-CLIENTE] quit
```

---

## Criar Traffic Behavior (CAR — Committed Access Rate)

```bash
# Limitar a 10 Mbps
# cir: taxa comprometida (kbps) | cbs: burst comprometido (bytes) | pbs: burst de pico (bytes)
[SW] traffic behavior LIMIT-10M
[SW-behavior-LIMIT-10M] car cir 10000 cbs 1000000 pbs 2000000 green pass yellow pass red discard
[SW-behavior-LIMIT-10M] quit
```

---

## Criar Traffic Policy e Aplicar na Interface

```bash
# Criar a política unindo classifier + behavior
[SW] traffic policy POL-CLIENTES
[SW-trafficpolicy-POL-CLIENTES] classifier CLASS-CLIENTE behavior LIMIT-10M
[SW-trafficpolicy-POL-CLIENTES] quit

# Aplicar na interface de entrada (inbound = limita o que chega ao switch)
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] traffic-policy POL-CLIENTES inbound
[SW-GE0/0/1] quit
```

---

## Remarcar DSCP

Útil para marcar tráfego prioritário (ex: VoIP como EF, dados críticos como AF41).

```bash
[SW] traffic behavior REMARK-EF
[SW-behavior-REMARK-EF] remark dscp ef
[SW-behavior-REMARK-EF] quit
```

---

## Queue Scheduling (WFQ / PQ)

Garante banda proporcional ou prioridade absoluta por fila de saída:

```bash
[SW] interface GigabitEthernet 0/0/1
# Filas 0 e 1: WFQ com pesos 10 e 20
[SW-GE0/0/1] qos queue 0 wrr weight 10
[SW-GE0/0/1] qos queue 1 wrr weight 20
# Fila 5: prioridade estrita (strict priority — drena antes das demais)
[SW-GE0/0/1] qos queue 5 pq
[SW-GE0/0/1] quit
```

---

## Storm Control

Protege contra tempestades de broadcast/multicast/unknown-unicast:

```bash
[SW] interface GigabitEthernet 0/0/1
# Bloquear quando broadcast ultrapassar 2000 pps
[SW-GE0/0/1] storm-control broadcast min-rate 1000 max-rate 2000
[SW-GE0/0/1] storm-control action block
[SW-GE0/0/1] quit
```

---

## Verificar QoS

```bash
# Estatísticas de tráfego classificado na interface
<SW> display traffic policy statistics interface GigabitEthernet 0/0/1 inbound

# Classifiers configurados
<SW> display traffic classifier user-defined

# Behaviors configurados
<SW> display traffic behavior user-defined

# Políticas configuradas
<SW> display traffic policy user-defined
```

---

## Problemas Comuns

### Limitação de banda não está sendo aplicada

```bash
# 1. Confirmar que a policy está aplicada na interface correta
<SW> display interface GigabitEthernet 0/0/1
# Buscar: "traffic-policy POL-CLIENTES inbound"

# 2. Verificar estatísticas (se green/yellow/red estão sendo contados)
<SW> display traffic policy statistics interface GigabitEthernet 0/0/1 inbound

# 3. Confirmar que a ACL está correspondendo ao tráfego
<SW> display acl 3001
```

### Storm control bloqueou a interface

```bash
# Verificar se a interface está bloqueada por storm control
<SW> display interface GigabitEthernet 0/0/1
# Buscar: "storm-control"

# Desbloquear manualmente
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] undo shutdown
[SW-GE0/0/1] quit
```

---

## Veja Também

- [VLAN e Interfaces — Switch Huawei](./vlan)
- [Troubleshooting — Switch Huawei](./troubleshooting)
- [Controle de Banda — Roteador Huawei](/pt/roteadores/huawei/controle-de-banda)
