---
description: Pesquisar, autorizar e gerenciar ONUs GPON na OLT Huawei MA5800 — auto-find, ont confirm, service-port e verificação de sinal.
---

# GPON — Pesquisar e Autorizar ONUs — OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

Guia de provisionamento de ONUs GPON na OLT Huawei: habilitação de auto-find, localização de ONUs não autorizadas, confirmação com número serial, criação de service-port e verificação de sinal óptico.

## Ativar Auto-Find nas Portas PON

```bash
# Global
MA5800-X2(config)# xpon port ont-auto-find all enable

# Por slot
(config)# interface gpon 0/1
(config-if-gpon-0/1)# port 0 ont-auto-find enable
(config-if-gpon-0/1)# port 1 ont-auto-find enable
# ... repetir para todas as portas necessárias
```

## Pesquisar ONUs Não Autorizadas

```bash
# Busca global — todas as ONUs aguardando autorização
MA5800-X2(config)# display ont autofind all

# Busca em slot/porta específica
MA5800-X2(config)# interface gpon 0/1
MA5800-X2(config-if-gpon-0/1)# display ont autofind 1
```

Saída de exemplo:
```
 Number              : 1
 F/S/P               : 0/1/1
 Ont SN              : 4857544360D3AC3D (HWTC-60D3AC3D)
 Password            : 0x00000000000000000000
 VendorID            : HWTC
 Ont Version         : AF6.A
 Ont SoftwareVersion : V3R017C10S120
 Ont EquipmentID     : EG8120L
 Ont autofind time   : 17/03/2021 23:26:38-03:00
```

## Autorizar (Confirmar) ONU

```bash
# Sintaxe: ont confirm <PON> ontid <ID> sn-auth <SN> omci ont-lineprofile-id <LP> ont-srvprofile-id <SP> desc <nome>
MA5800-X2(config-if-gpon-0/1)# ont confirm 1 ontid 0 sn-auth 4857544369241B3D omci ont-lineprofile-id 10 ont-srvprofile-id 0 desc Cliente-01

# Com line-profile e srv-profile específicos
MA5800-X2(config-if-gpon-0/1)# ont confirm 3 ontid 1 sn-auth 48575443BDEE3A3D omci ont-lineprofile-id 130 ont-srvprofile-id 0 desc Nairton-02
```

## Adicionar ONU com `ont add`

```bash
# Dentro da interface gpon
(config-if-gpon-0/2)# ont add 4 22 sn-auth 5A544547C4A0A0CC omci ont-lineprofile-id 425
(config-if-gpon-0/2)# ont port native-vlan 4 22 eth 1 vlan 425 priority 0
```

## Criar Service-Port

```bash
# Associar ONU à VLAN de serviço
MA5800-X2(config)# service-port vlan 10 gpon 0/1/1 ont 1 gemport 1 multi-service user-vlan 10

# Com tag-transform
(config)# service-port vlan 425 gpon 0/2/4 ont 22 gemport 1 multi-service user-vlan 425 tag-transform translate

# Verificar
(config)# display service-port all
```

## Verificar ONUs Autorizadas

```bash
# Por número serial
MA5800-X2(config)# display ont info by-sn 4857544360D3AC3D

# Resumo de uma porta PON
MA5800-X2(config-if-gpon-0/7)# display ont info summary 5

# ONU específica (porta 1, ONU 0)
MA5800-X2(config-if-gpon-0/1)# display ont info 1 0

# Potência óptica de todas as ONUs na porta 1
MA5800-X2(config-if-gpon-0/1)# display ont optical-info 1 all

# Informações de uma ONT específica
(config)# display current-configuration ont 0/1/1 0
```

## Verificar Tráfego

```bash
MA5800-X7(config-if-gpon-0/7)# display port traffic 5
MA5800-X7(config-if-gpon-0/7)# display port period-traffic 5
MA5800-X7(config)# display traffic vlan 10
```

## Buscar Service-Port de uma ONU

```bash
(config)# display service-port port 0/1/1 ont 0
```

## Deletar Service-Port

```bash
# Deletar todos de uma porta
MA5800-X7(config)# undo service-port port 0/1/1

# Deletar de ONU específica
MA5800-X7(config)# undo service-port port 0/1/1 ont 0
```

## Deletar ONU

```bash
MA5800-X7(config)# interface gpon 0/1
MA5800-X7(config-if-gpon-0/7)# ont delete 1 0
```

---

## Veja Também

- [Serviços (DBA/Profiles) — OLT Huawei](./servicos-perfis)
- [Interfaces e VLANs — OLT Huawei](./interface-vlan)
- [Troubleshooting / Sinal — OLT Huawei](./troubleshooting)
- [Configuração Inicial — OLT Huawei](./configuracao-inicial)
