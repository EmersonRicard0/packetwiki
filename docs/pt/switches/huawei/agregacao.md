---
description: Configuração de agregação de links (Eth-Trunk / LACP) em switches Huawei — modo ativo, manual, trunk sobre bond e balanceamento de carga.
---

# Agregação de Links (LACP / Eth-Trunk) — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de agregação de links (bonding) em switches Huawei usando Eth-Trunk. Suporta LACP (IEEE 802.3ad) para negociação dinâmica e modo manual para equipamentos sem suporte a LACP.

---

## Criar Eth-Trunk com LACP (Modo Ativo)

LACP negocia automaticamente os links ativos e detecta falhas.

```bash
# Criar o grupo de agregação
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] mode lacp-static
[SW-Eth-Trunk1] description Uplink-Core-Agregado

# Adicionar interfaces membros
[SW-Eth-Trunk1] trunkport GigabitEthernet 0/0/1
[SW-Eth-Trunk1] trunkport GigabitEthernet 0/0/2
[SW-Eth-Trunk1] quit
```

---

## Eth-Trunk Modo Manual (sem LACP)

Use quando o equipamento do outro lado não suporta LACP.

```bash
[SW] interface Eth-Trunk 2
[SW-Eth-Trunk2] mode manual load-balance
[SW-Eth-Trunk2] trunkport GigabitEthernet 0/0/3
[SW-Eth-Trunk2] trunkport GigabitEthernet 0/0/4
[SW-Eth-Trunk2] quit
```

---

## Configurar Trunk sobre Eth-Trunk

```bash
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] port link-type trunk
[SW-Eth-Trunk1] port trunk allow-pass vlan all
[SW-Eth-Trunk1] quit
```

---

## Configurar Access sobre Eth-Trunk

```bash
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] port link-type access
[SW-Eth-Trunk1] port default vlan 100
[SW-Eth-Trunk1] quit
```

---

## Balanceamento de Carga

```bash
# Por IP de origem e destino (recomendado para tráfego L3)
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] load-balance src-dst-ip
[SW-Eth-Trunk1] quit

# Por MAC de origem e destino (para tráfego L2 puro)
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] load-balance src-dst-mac
[SW-Eth-Trunk1] quit
```

---

## Exemplo Completo — Uplink com 2x 10GE

Configuração típica de uplink agregado para um PE:

```bash
[SW] interface Eth-Trunk 10
[SW-Eth-Trunk10] description Uplink-PE-01
[SW-Eth-Trunk10] mode lacp-static
[SW-Eth-Trunk10] max active-linknumber 2
[SW-Eth-Trunk10] port link-type trunk
[SW-Eth-Trunk10] port trunk allow-pass vlan all
[SW-Eth-Trunk10] trunkport XGigabitEthernet 0/0/1
[SW-Eth-Trunk10] trunkport XGigabitEthernet 0/0/2
[SW-Eth-Trunk10] quit
```

---

## Verificar Agregação

```bash
# Estado do Eth-Trunk e links membros
<SW> display eth-trunk 1

# Membros da agregação
<SW> display trunkmembership eth-trunk 1

# Estatísticas LACP (PDUs enviados/recebidos)
<SW> display lacp statistics eth-trunk 1
```

---

## Problemas Comuns

### Link membro não entra no Eth-Trunk (estado "Detach")

```bash
# Verificar estado dos membros
<SW> display eth-trunk 1
# Links em "Detach": LACP não negociou — verificar o outro lado

# Causas comuns:
# 1. Velocidade/duplex diferente entre os membros
# 2. O outro switch tem LACP desabilitado ou em modo diferente
# 3. Número máximo de links ativos atingido (max active-linknumber)
```

### Eth-Trunk está "DOWN"

```bash
# Todos os membros devem estar UP para o trunk ficar UP
<SW> display interface brief | include Eth-Trunk

# Verificar interface física dos membros
<SW> display interface GigabitEthernet 0/0/1
```

### Tráfego concentrado em um único link

```bash
# Verificar o algoritmo de balanceamento
<SW> display eth-trunk 1
# Se todo o tráfego for de um mesmo par IP/MAC, é esperado

# Alterar para hash por pacote (menos eficiente, mas mais distribuído)
[SW] interface Eth-Trunk 1
[SW-Eth-Trunk1] load-balance src-dst-ip
```

---

## Veja Também

- [VLAN e Interfaces — Switch Huawei](./vlan)
- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [Troubleshooting — Switch Huawei](./troubleshooting)
