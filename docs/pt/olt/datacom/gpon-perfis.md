# Perfis GPON — OLT Datacom

::: tip Versão testada
DmOS **21.1** (DM4615 / DM4610). Compatível com DmOS 19.x+.
:::

Os perfis GPON no DmOS definem o comportamento de banda, encapsulamento e serviços das ONUs.

## Bandwidth-Profile (DBA)

O **bandwidth-profile** controla a alocação dinâmica de banda (DBA) no upstream.

### Tipos de T-CONT

| Tipo | Descrição |
|------|-----------|
| T-CONT 1 | Fixed — banda fixa garantida |
| T-CONT 2 | Assured — banda assegurada com burst |
| T-CONT 3 | Non-Assured — banda não assegurada |
| T-CONT 4 | Best-Effort — melhor esforço |
| T-CONT 5 | Mixed — combinação de tipos |

### Criar Bandwidth-Profile

```bash
# T-CONT tipo 4 — Best Effort, 1 Gbps máximo
DM(config)# gpon
DM(config-gpon)# bandwidth-profile 10 name "1G-BE"
DM(config-gpon-bwprofile-10)# type best-effort maximum 1024000
DM(config-gpon-bwprofile-10)# exit

# T-CONT tipo 4 — 100 Mbps
DM(config-gpon)# bandwidth-profile 20 name "100M-BE"
DM(config-gpon-bwprofile-20)# type best-effort maximum 102400
DM(config-gpon-bwprofile-20)# exit

# T-CONT tipo 2 — Assured (garantido + burst)
DM(config-gpon)# bandwidth-profile 30 name "50M-ASSURED"
DM(config-gpon-bwprofile-30)# type assured assured 51200 maximum 102400
DM(config-gpon-bwprofile-30)# exit

# T-CONT tipo 1 — Fixed (VoIP)
DM(config-gpon)# bandwidth-profile 40 name "VOIP-FIXED"
DM(config-gpon-bwprofile-40)# type fixed fixed 2048
DM(config-gpon-bwprofile-40)# exit
```

> **Unidade:** Kbps.

### Verificar Bandwidth-Profiles

```bash
DM# show gpon bandwidth-profile
DM# show gpon bandwidth-profile 10
```

## Line-Profile

O **line-profile** define os T-CONTs e GEM ports, e o mapeamento de VLANs.

### Line-Profile Simples (1 VLAN)

```bash
DM(config-gpon)# line-profile 10 name "LP-INTERNET"
DM(config-gpon-lineprofile-10)# tcont 1 bandwidth-profile 10
DM(config-gpon-lineprofile-10)# gem-port 1 tcont 1
DM(config-gpon-lineprofile-10)# gem-port 1 vlan 100
DM(config-gpon-lineprofile-10)# exit
```

### Line-Profile com Duas VLANs (Dados + VoIP)

```bash
DM(config-gpon)# line-profile 11 name "LP-DADOS-VOIP"
DM(config-gpon-lineprofile-11)# tcont 1 bandwidth-profile 10
DM(config-gpon-lineprofile-11)# gem-port 1 tcont 1
DM(config-gpon-lineprofile-11)# gem-port 1 vlan 10
DM(config-gpon-lineprofile-11)# tcont 2 bandwidth-profile 40
DM(config-gpon-lineprofile-11)# gem-port 2 tcont 2
DM(config-gpon-lineprofile-11)# gem-port 2 vlan 11
DM(config-gpon-lineprofile-11)# exit
```

### Line-Profile Transparente (L2L)

```bash
DM(config-gpon)# line-profile 6 name "LP-L2L"
DM(config-gpon-lineprofile-6)# mapping-mode port
DM(config-gpon-lineprofile-6)# tcont 1 bandwidth-profile 10
DM(config-gpon-lineprofile-6)# gem-port 1 tcont 1
DM(config-gpon-lineprofile-6)# exit
```

### Verificar Line-Profiles

```bash
DM# show gpon line-profile
DM# show gpon line-profile 10
```

## Service-Profile

O **service-profile** define o número de portas ETH/POTS da ONU e o mapeamento de VLANs nas portas.

### Service-Profile Padrão (4 ETH)

```bash
DM(config-gpon)# service-profile 10 name "SP-4ETH"
DM(config-gpon-srvprofile-10)# ont-port eth 4 pots 0
DM(config-gpon-srvprofile-10)# port vlan eth 1 100
DM(config-gpon-srvprofile-10)# port vlan eth 2 100
DM(config-gpon-srvprofile-10)# port vlan eth 3 100
DM(config-gpon-srvprofile-10)# port vlan eth 4 100
DM(config-gpon-srvprofile-10)# exit
```

### Service-Profile com VoIP (4 ETH + 1 POTS)

```bash
DM(config-gpon)# service-profile 11 name "SP-4ETH-1POTS"
DM(config-gpon-srvprofile-11)# ont-port eth 4 pots 1
DM(config-gpon-srvprofile-11)# port vlan eth 1 10
DM(config-gpon-srvprofile-11)# port vlan eth 2 10
DM(config-gpon-srvprofile-11)# port vlan eth 3 10
DM(config-gpon-srvprofile-11)# port vlan eth 4 11
DM(config-gpon-srvprofile-11)# exit
```

### Service-Profile Transparente

```bash
DM(config-gpon)# service-profile 6 name "SP-TRANSPARENTE"
DM(config-gpon-srvprofile-6)# ont-port eth 4 pots 0
DM(config-gpon-srvprofile-6)# port vlan eth 1 transparent
DM(config-gpon-srvprofile-6)# port vlan eth 2 transparent
DM(config-gpon-srvprofile-6)# port vlan eth 3 transparent
DM(config-gpon-srvprofile-6)# port vlan eth 4 transparent
DM(config-gpon-srvprofile-6)# exit
```

### Verificar Service-Profiles

```bash
DM# show gpon service-profile
DM# show gpon service-profile 10
```

## RG-Profile (Residential Gateway)

O **RG-Profile** configura o roteador embutido na ONU (modo RG/router), habilitando PPPoE pass-through ou DHCP na WAN.

```bash
DM(config-gpon)# rg-profile 1 name "RG-PPPoE"
DM(config-gpon-rgprofile-1)# wan-connection pppoe
DM(config-gpon-rgprofile-1)# exit

DM(config-gpon)# rg-profile 2 name "RG-DHCP"
DM(config-gpon-rgprofile-2)# wan-connection dhcp
DM(config-gpon-rgprofile-2)# exit
```
