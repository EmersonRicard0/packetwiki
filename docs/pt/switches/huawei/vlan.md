---
description: Configuração de VLANs, modos access/trunk/hybrid e interfaces L3 (VLANIF) em switches Huawei CloudEngine e S-series.
---

# VLAN e Interfaces — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia completo de configuração de VLANs e interfaces em switches Huawei: criação de VLANs, configuração dos modos access, trunk e hybrid, interfaces L3 (VLANIF) e comandos de verificação.

---

## Criar VLAN

```bash
# VLAN única
[SW] vlan 100
[SW-vlan100] description Clientes-Internet
[SW-vlan100] quit

# Múltiplas VLANs de uma vez
[SW] vlan batch 100 200 300 400
```

---

## Modos de Interface

### Access (cliente final)

Porta de acesso: carrega tráfego de uma única VLAN sem tag.

```bash
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] port link-type access
[SW-GE0/0/1] port default vlan 100
[SW-GE0/0/1] description Cliente-01
[SW-GE0/0/1] quit
```

### Trunk (uplink / interconexão)

Porta trunk: transporta múltiplas VLANs com tag 802.1Q entre switches ou uplinks.

```bash
[SW] interface GigabitEthernet 0/0/2
[SW-GE0/0/2] port link-type trunk
[SW-GE0/0/2] port trunk allow-pass vlan 100 200 300
[SW-GE0/0/2] port trunk pvid vlan 1
[SW-GE0/0/2] description Uplink-Core
[SW-GE0/0/2] quit
```

### Hybrid (modo híbrido)

Porta hybrid: combina VLANs com e sem tag na mesma interface. Útil em redes GPON/OLT.

```bash
[SW] interface GigabitEthernet 0/0/3
[SW-GE0/0/3] port link-type hybrid
[SW-GE0/0/3] port hybrid tagged vlan 100 200
[SW-GE0/0/3] port hybrid untagged vlan 1
[SW-GE0/0/3] quit
```

---

## Desabilitar / Habilitar Interface

```bash
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] shutdown
[SW-GE0/0/1] undo shutdown
```

---

## Interface Loopback

Usada como Router-ID em OSPF/BGP. Sempre ativa enquanto o equipamento estiver operacional.

```bash
[SW] interface LoopBack 0
[SW-LoopBack0] ip address 10.255.255.1 255.255.255.255
[SW-LoopBack0] description Router-ID
[SW-LoopBack0] quit
```

---

## Interface VLANIF (L3)

Interface lógica de camada 3 associada a uma VLAN. Serve como gateway para os hosts da VLAN.

```bash
[SW] interface Vlanif 100
[SW-Vlanif100] ip address 192.168.100.1 255.255.255.0
[SW-Vlanif100] description Gateway-Clientes
[SW-Vlanif100] quit
```

---

## Descrição em Massa

Para documentar rapidamente múltiplas interfaces:

```bash
[SW] interface GigabitEthernet 0/0/1
[SW-GE0/0/1] description OLT-MA5800-GE0
[SW-GE0/0/1] quit
[SW] interface GigabitEthernet 0/0/2
[SW-GE0/0/2] description UPLINK-CORE-SW01-GE1
[SW-GE0/0/2] quit
```

---

## Verificar VLANs e Interfaces

```bash
# Listar todas as VLANs
<SW> display vlan

# Detalhar uma VLAN específica
<SW> display vlan 100

# Resumo de todas as interfaces (status up/down)
<SW> display interface brief

# Ver em quais VLANs cada porta está
<SW> display port vlan

# Detalhes de uma interface específica
<SW> display interface GigabitEthernet 0/0/1

# Ver contadores de erro
<SW> display counters error interface GigabitEthernet 0/0/1
```

---

## Problemas Comuns

### VLANIF não responde a ping

```bash
# 1. Confirmar que a VLAN existe
<SW> display vlan 100

# 2. Verificar se alguma porta access ou trunk está nessa VLAN
<SW> display port vlan

# 3. Verificar status da VLANIF
<SW> display interface Vlanif 100
# Esperado: "Vlanif100 current state: UP"
# Se "DOWN", nenhuma porta ativa pertence à VLAN

# 4. Verificar rota padrão
<SW> display ip routing-table 0.0.0.0
```

### Porta trunk não transporta a VLAN

```bash
# Verificar quais VLANs estão permitidas na trunk
<SW> display port vlan GigabitEthernet 0/0/2

# Adicionar VLAN que está faltando
[SW] interface GigabitEthernet 0/0/2
[SW-GE0/0/2] port trunk allow-pass vlan 200
[SW-GE0/0/2] quit
```

### Interface presa em "DOWN"

```bash
# Verificar se está em shutdown administrativo
<SW> display interface GigabitEthernet 0/0/1
# Procurar: "Administratively DOWN" (corrigir com undo shutdown)
# ou: "DOWN  (optical module absent)" (problema físico — SFP)
```

---

## Veja Também

- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [Agregação de Links — Switch Huawei](./agregacao)
- [MPLS / LDP — Switch Huawei](./mpls)
- [Troubleshooting — Switch Huawei](./troubleshooting)
