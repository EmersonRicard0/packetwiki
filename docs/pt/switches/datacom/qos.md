# QoS — Switch Datacom

::: tip Versão testada
DmOS **21.1** (DM2500 / DM4370 / DM4610). Compatível com DmOS 19.x+.
:::

## Conceitos de QoS no DmOS

| Termo | Descrição |
|-------|-----------|
| Policer | Controle de banda (limitar tráfego) |
| Shaper | Conformação de taxa (suavizar rajadas) |
| Queue | Fila de saída (8 prioridades) |
| DSCP | Differentiated Services Code Point (6 bits no IP) |
| CoS | Class of Service (3 bits no 802.1Q) |
| Remark | Reescrever DSCP/CoS no pacote |

## Policiamento de Banda (Traffic Policing)

### Criar Policy-Map para Limitar Banda

```bash
# Criar class-map para identificar tráfego
DM(config)# class-map match-any CLIENTES-100M
DM(config-cmap-CLIENTES-100M)# match any
DM(config-cmap-CLIENTES-100M)# exit

# Criar policy-map com policer
DM(config)# policy-map PM-100MBPS
DM(config-pmap-PM-100MBPS)# class CLIENTES-100M
DM(config-pmap-PM-100MBPS-c-CLIENTES-100M)# police rate 100000 kbps burst 1000 kbyte
DM(config-pmap-PM-100MBPS-c-CLIENTES-100M)# conform-action transmit
DM(config-pmap-PM-100MBPS-c-CLIENTES-100M)# exceed-action drop
DM(config-pmap-PM-100MBPS-c-CLIENTES-100M)# exit
DM(config-pmap-PM-100MBPS)# exit

# Aplicar na interface (entrada)
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# service-policy input PM-100MBPS
DM(config-if-eth0/1)# exit
```

### Policer por VLAN

```bash
DM(config)# class-map match-all VLAN-CLIENTES
DM(config-cmap-VLAN-CLIENTES)# match vlan 10
DM(config-cmap-VLAN-CLIENTES)# exit

DM(config)# policy-map PM-VLAN-100M
DM(config-pmap)# class VLAN-CLIENTES
DM(config-pmap-c)# police rate 100000 kbps
DM(config-pmap-c)# conform-action transmit
DM(config-pmap-c)# exceed-action drop
DM(config-pmap-c)# exit
DM(config-pmap)# exit
```

## Marcação DSCP (Remarking)

```bash
# Marcar pacotes com DSCP EF (voz/prioridade alta)
DM(config)# class-map match-all VOIP-TRAFFIC
DM(config-cmap-VOIP-TRAFFIC)# match vlan 20
DM(config-cmap-VOIP-TRAFFIC)# exit

DM(config)# policy-map PM-REMARK-VOIP
DM(config-pmap)# class VOIP-TRAFFIC
DM(config-pmap-c)# set dscp ef
DM(config-pmap-c)# exit
DM(config-pmap)# exit

DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# service-policy input PM-REMARK-VOIP
DM(config-if-eth0/1)# exit
```

## Filas de Saída (Queuing)

O DmOS suporta 8 filas por porta com prioridade estrita (SP) ou WFQ:

```bash
# Configurar mapeamento DSCP → fila
DM(config)# qos dscp-map
DM(config-dscp-map)# dscp ef queue 7         # VoIP → fila 7 (alta prioridade)
DM(config-dscp-map)# dscp af41 queue 5       # Video → fila 5
DM(config-dscp-map)# dscp default queue 0    # Best-effort → fila 0
DM(config-dscp-map)# exit

# Configurar filas na interface
DM(config)# interface ethernet 0/24
DM(config-if-eth0/24)# queue strict-priority 7   # fila 7 tem prioridade estrita
DM(config-if-eth0/24)# queue weight 6 20         # fila 6 — 20% largura de banda
DM(config-if-eth0/24)# queue weight 0 5          # fila 0 — 5% largura de banda
DM(config-if-eth0/24)# exit
```

## Storm Control

Limitar tráfego broadcast/multicast/unicast desconhecido:

```bash
DM(config)# interface ethernet 0/1
DM(config-if-eth0/1)# storm-control broadcast level 10    # 10% de banda máxima
DM(config-if-eth0/1)# storm-control multicast level 10
DM(config-if-eth0/1)# storm-control unicast level 20
DM(config-if-eth0/1)# storm-control action shutdown       # desliga porta se exceder
DM(config-if-eth0/1)# exit
```

## Verificar QoS

```bash
DM# show policy-map
DM# show policy-map interface ethernet 0/1
DM# show class-map
DM# show qos interface ethernet 0/1
DM# show interface ethernet 0/1 counters
