---
description: Criação de DBA profiles, line profiles, service profiles e serviços GPON na OLT Huawei MA5800.
---

# Serviços, DBA e Profiles — OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

## Criar VLAN de Serviço

```bash
MA5800-X2(config)# vlan 10 smart
MA5800-X2(config)# vlan desc 10 description SER.INTERNET
MA5800-X7(config)# vlan name 10 SER.INTERNET

MA5800-X2(config)# vlan 11 smart
MA5800-X2(config)# vlan desc 11 description SER.VOIP
MA5800-X7(config)# vlan name 11 SER.VOIP

# Associar à porta MPU
MA5800-X2(config)# port vlan 10 0/8 0-3

# Verificar
(config)# display vlan 10
(config)# display port vlan 0/3/3
```

## Criar DBA-Profile (T-CONT)

DBA (Dynamic Bandwidth Allocation) controla a largura de banda upstream das ONUs.

```bash
# T-CONT tipo 4 — banda máxima garantida (1 Gbps)
MA5800-X2(config)# dba-profile add profile-id 10 profile-name "1G" type4 max 1100000

# T-CONT tipo 4 — 100 Mbps
MA5800-X2(config)# dba-profile add profile-id 20 profile-name "100M" type4 max 110000

# Verificar
MA5800-X2(config)# display dba-profile all
MA5800-X2(config)# display dba-profile profile-id 10
```

> **Unidade:** Kbps. Para 100 Mbps use 110000 (10% overhead GPON).

## Criar Line-Profile

O **line-profile** define como os T-CONTs e GEM ports são mapeados.

### Uma VLAN por ONU

```bash
(config)# ont-lineprofile gpon profile-id 10 profile-name "line-profile_10"
(config-gpon-lineprofile-10)# tcont 1 dba-profile-id 10
(config-gpon-lineprofile-10)# gem add 1 eth tcont 1
(config-gpon-lineprofile-10)# gem mapping 1 0 vlan 100
(config-gpon-lineprofile-10)# commit
(config-gpon-lineprofile-10)# quit
```

### Duas VLANs por ONU (Dados + VoIP)

```bash
(config)# ont-lineprofile gpon profile-id 11 profile-name "voz e dados"
(config-gpon-lineprofile-11)# tcont 1 dba-profile-id 10
(config-gpon-lineprofile-11)# gem add 1 eth tcont 1
(config-gpon-lineprofile-11)# gem mapping 1 1 vlan 10
(config-gpon-lineprofile-11)# tcont 2 dba-profile-id 11
(config-gpon-lineprofile-11)# gem add 2 eth tcont 2
(config-gpon-lineprofile-11)# gem mapping 2 1 vlan 11
(config-gpon-lineprofile-11)# commit
(config-gpon-lineprofile-11)# quit
```

### Line-Profile com criptografia OMCI

```bash
(config)# ont-lineprofile gpon profile-id 27 profile-name "vlan27"
(config-gpon-lineprofile-27)# omcc encrypt on
(config-gpon-lineprofile-27)# tcont 1 dba-profile-id 10
(config-gpon-lineprofile-27)# gem add 1 eth tcont 1 encrypt on
(config-gpon-lineprofile-27)# gem mapping 1 1 vlan 27
(config-gpon-lineprofile-27)# commit
(config-gpon-lineprofile-27)# quit
```

### Line-Profile para L2L Transparente

```bash
(config)# ont-lineprofile gpon profile-id 6 profile-name "L2L_TRANSPORTE"
(config-gpon-lineprofile-6)# mapping-mode port
(config-gpon-lineprofile-6)# tcont 3 dba-profile-id 14
(config-gpon-lineprofile-6)# gem add 1 eth tcont 3 downstream-priority-queue 0
(config-gpon-lineprofile-6)# gem mapping 1 0 eth 1 priority 0
(config-gpon-lineprofile-6)# commit
(config-gpon-lineprofile-6)# quit
```

## Criar Srv-Profile (Service Profile)

O **srv-profile** define as portas físicas da ONU e o mapeamento de VLANs.

### 4 Portas ETH — VLAN 100

```bash
(config)# ont-srvprofile gpon profile-id 100 profile-name "srv-profile_100"
(config-gpon-srvprofile-100)# ont-port pots adaptive eth adaptive catv adaptive
(config-gpon-srvprofile-100)# port vlan eth 1 translation 100 user-vlan 100
(config-gpon-srvprofile-100)# port vlan eth 2 translation 100 user-vlan 100
(config-gpon-srvprofile-100)# port vlan eth 3 translation 100 user-vlan 100
(config-gpon-srvprofile-100)# port vlan eth 4 translation 100 user-vlan 100
(config-gpon-srvprofile-100)# commit
(config-gpon-srvprofile-100)# quit
```

### 4 LANs + 1 POTS — VLAN 10 (dados) e VLAN 11 (VoIP)

```bash
MA5800-X2(config)# ont-srvprofile gpon profile-id 10 profile-name "4LAN-1pots-v10-v11"
MA5800-X2(config-gpon-srvprofile-10)# ont-port eth 4 pots 1
MA5800-X2(config-gpon-srvprofile-10)# port vlan eth 1-3 10
MA5800-X2(config-gpon-srvprofile-10)# port vlan eth 4 11
MA5800-X2(config-gpon-srvprofile-10)# port vlan iphost 11
MA5800-X2(config-gpon-srvprofile-10)# commit
MA5800-X2(config-gpon-srvprofile-10)# quit
```

### L2L Transparente

```bash
(config)# ont-srvprofile gpon profile-id 6 profile-name "L2L_TRANSPORTE"
(config-gpon-srvprofile-6)# ont-port eth adaptive 8
(config-gpon-srvprofile-6)# port vlan eth 1 transparent
(config-gpon-srvprofile-6)# port vlan eth 2 transparent
(config-gpon-srvprofile-6)# port vlan eth 3 transparent
(config-gpon-srvprofile-6)# port vlan eth 4 transparent
(config-gpon-srvprofile-6)# commit
(config-gpon-srvprofile-6)# quit
```

## Verificar Profiles

```bash
MA5800-X7(config)# display ont-srvprofile gpon profile-id 10
(config)# display dba-profile all
```
