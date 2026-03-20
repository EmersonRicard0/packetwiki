---
description: Configuração de VLANs, portas MPU e interface de gerência (VLANIF) na OLT Huawei MA5800.
---

# Interfaces e VLANs — OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

## Criar VLAN

```bash
# VLAN do tipo smart (modo padrão em OLTs)
MA5800-X2(config)# vlan 1311 smart

# VLAN com descrição e nome
MA5800-X2(config)# vlan desc 1000 description Gerencia-Inband
MA5800-X2(config)# vlan name 1000 gerencia-inband

# Verificar
MA5800-X7(config)# display vlan all
MA5800-X7(config)# display vlan 1000
```

## Associar Porta MPU à VLAN

```bash
# Adicionar porta(s) à VLAN
# Sintaxe: port vlan <vlan-id> <chassis/slot> <porta-inicial>-<porta-final>
MA5800-X2(config)# port vlan 1000 0/3 0-3
MA5800-X2(config)# port vlan 1000 0/4 0-3

# Verificar
MA5800-X7(config)# display port vlan 0/3/0
```

## VLAN com Native VLAN (porta com VLAN default)

```bash
(config)# vlan 3905 smart
(config)# interface mpu 0/8
(config-if-mpu-0/8)# native-vlan 0 vlan 3905
# [0 = número da porta]
```

## Verificar Estado das Portas MPU

```bash
(config)# interface mpu 0/8
(config-if-mpu-0/8)# display port state all
(config-if-mpu-0/8)# display port vlan 0/8/0
```

## Desligar / Ligar Porta MPU

```bash
(config)# interface mpu 0/8
(config-if-mpu-0/8)# shutdown 0
(config-if-mpu-0/8)# undo shutdown 0
```

## Verificar Óptica das Portas

```bash
# Estado óptico de todas as portas
(config-if-mpu-0/8)# display port opticstate all

# Informações DDM (potência óptica) da porta 0
(config-if-mpu-0/8)# display port ddm-info 0
```

## Configurar IP de Gerência (VLANIF)

```bash
(config)# vlan 1000 smart
(config)# vlan desc 1000 description Gerencia
(config)# interface vlanif 1000
(config-if-vlanif1000)# ip address 10.11.104.2 255.255.255.0
(config-if-vlanif1000)# quit
(config)# ip route-static 0.0.0.0 0.0.0.0 10.11.104.1
```

---

## Veja Também

- [Configuração Inicial — OLT Huawei](./configuracao-inicial)
- [GPON — ONUs — OLT Huawei](./gpon-ont)
- [Serviços (DBA/Profiles) — OLT Huawei](./servicos-perfis)
- [Troubleshooting / Sinal — OLT Huawei](./troubleshooting)
