# Provisionamento de ONUs — OLT Datacom

::: tip Versão testada
DmOS **21.1** (DM4615 / DM4610). Compatível com DmOS 19.x+.
:::

## Ver ONUs Descobertas (Auto-Discovery)

Quando uma ONU é conectada à porta PON, ela aparece como não-autorizada:

```bash
DM# show gpon onu unauthorized
DM# show gpon onu unauthorized interface gpon 0/1
```

Saída típica:
```
Interface  ONU-ID  Serial Number    State
gpon0/1    -       DTCO12345678     unauthorized
```

## Autorizar ONU por Serial Number

```bash
DM(config)# interface gpon 0/1
DM(config-if-gpon0/1)# onu 1 serial-number DTCO12345678
DM(config-if-gpon0/1)# onu 1 line-profile 10
DM(config-if-gpon0/1)# onu 1 service-profile 10
DM(config-if-gpon0/1)# onu 1 description "Cliente Joao Silva"
DM(config-if-gpon0/1)# exit
```

## Configurar Service-Port (Serviço de Internet)

O **service-port** associa a ONU a uma VLAN de serviço no uplink:

```bash
DM(config)# gpon
DM(config-gpon)# service-port 1
DM(config-gpon-sp-1)# onu interface gpon 0/1 onu-id 1
DM(config-gpon-sp-1)# gem-port 1
DM(config-gpon-sp-1)# vlan 100
DM(config-gpon-sp-1)# description "Internet-Cliente-Joao"
DM(config-gpon-sp-1)# no shutdown
DM(config-gpon-sp-1)# exit
```

## Provisionamento Completo — Exemplo

```bash
# 1. Entrar na interface PON
DM(config)# interface gpon 0/2

# 2. Autorizar ONU
DM(config-if-gpon0/2)# onu 5 serial-number HWTC1A2B3C4D
DM(config-if-gpon0/2)# onu 5 line-profile 10
DM(config-if-gpon0/2)# onu 5 service-profile 10
DM(config-if-gpon0/2)# onu 5 description "CLIENTE-100M"
DM(config-if-gpon0/2)# exit

# 3. Criar service-port
DM(config)# gpon
DM(config-gpon)# service-port 50
DM(config-gpon-sp-50)# onu interface gpon 0/2 onu-id 5
DM(config-gpon-sp-50)# gem-port 1
DM(config-gpon-sp-50)# vlan 100
DM(config-gpon-sp-50)# description "INET-CLIENTE-100M"
DM(config-gpon-sp-50)# no shutdown
DM(config-gpon-sp-50)# exit
```

## Provisionamento com VoIP (Duas VLANs)

```bash
# ONU com dados (VLAN 10) e VoIP (VLAN 11)
DM(config)# interface gpon 0/3
DM(config-if-gpon0/3)# onu 2 serial-number ZTEG11223344
DM(config-if-gpon0/3)# onu 2 line-profile 11
DM(config-if-gpon0/3)# onu 2 service-profile 11
DM(config-if-gpon0/3)# exit

# Service-port para dados
DM(config-gpon)# service-port 60
DM(config-gpon-sp-60)# onu interface gpon 0/3 onu-id 2
DM(config-gpon-sp-60)# gem-port 1
DM(config-gpon-sp-60)# vlan 10
DM(config-gpon-sp-60)# description "DADOS-CLIENTE"
DM(config-gpon-sp-60)# no shutdown
DM(config-gpon-sp-60)# exit

# Service-port para VoIP
DM(config-gpon)# service-port 61
DM(config-gpon-sp-61)# onu interface gpon 0/3 onu-id 2
DM(config-gpon-sp-61)# gem-port 2
DM(config-gpon-sp-61)# vlan 11
DM(config-gpon-sp-61)# description "VOIP-CLIENTE"
DM(config-gpon-sp-61)# no shutdown
DM(config-gpon-sp-61)# exit
```

## Verificar ONUs

```bash
# Listar todas as ONUs na OLT
DM# show gpon onu

# ONUs em uma porta específica
DM# show gpon onu interface gpon 0/1

# Detalhes de uma ONU específica
DM# show gpon onu interface gpon 0/1 onu-id 1

# Status operacional
DM# show gpon onu state interface gpon 0/1

# Sinal óptico (potência RX/TX)
DM# show gpon onu optical-info interface gpon 0/1

# Service-ports configurados
DM# show gpon service-port
DM# show gpon service-port 50
```

## Desautorizar / Remover ONU

```bash
DM(config)# interface gpon 0/1
DM(config-if-gpon0/1)# no onu 1
DM(config-if-gpon0/1)# exit
```

## Reiniciar ONU

```bash
DM# gpon onu reset interface gpon 0/1 onu-id 1
```

## Monitoramento de Porta PON

```bash
# Status da porta PON
DM# show interface gpon 0/1

# Contadores de erros
DM# show interface gpon 0/1 counters

# Potência óptica da porta OLT
DM# show gpon olt optical-info interface gpon 0/1
```
