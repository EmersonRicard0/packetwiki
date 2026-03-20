---
description: Configuração inicial da OLT Huawei MA5800 — acesso console, ativação de boards, auto-find GPON, backup FTP e salvamento.
---

# Configuração Inicial — OLT Huawei

::: tip Versão testada
MA5800 **V800R018C10** (MA5800-X2 / X7 / X17). Compatível com MA5600/MA5608 V800R013+.
:::

Guia para a primeira configuração de OLTs Huawei MA5800. Cobre acesso via console, ativação de boards, habilitação do auto-find GPON, backup automático e salvamento de configuração.

## Primeiro Acesso

```bash
# Console: 9600 8N1
# IP padrão: 10.11.104.2/24
# MA5600: usuário root / senha admin
# MA5800: usuário root / senha admin123

> enable
# config
```

## Verificar e Ativar Slots (Boards)

```bash
# Listar todos os slots
(config)# display board 0

# Confirmar/ativar um slot
(config)# board confirm 0/1
(config)# board confirm 0/2
```

## Verificar Alimentação

```bash
(config)# display power detail 0
```

## Ativar Auto-find em Todas as Portas GPON

```bash
# Global (todos os slots)
(config)# xpon port ont-auto-find all enable

# Por slot específico
(config)# xpon port ont-auto-find 0/1 enable

# Por slot/porta específica
(config)# xpon port ont-auto-find 0/1/1 enable

# Via interface GPON
(config)# interface gpon 0/1
(config-if-gpon-0/1)# port 0 ont-auto-find enable
(config-if-gpon-0/1)# port 1 ont-auto-find enable
(config-if-gpon-0/1)# port 2 ont-auto-find enable
(config-if-gpon-0/1)# port 3 ont-auto-find enable
(config-if-gpon-0/1)# port 4 ont-auto-find enable
(config-if-gpon-0/1)# port 5 ont-auto-find enable
(config-if-gpon-0/1)# port 6 ont-auto-find enable
(config-if-gpon-0/1)# port 7 ont-auto-find enable
(config-if-gpon-0/1)# quit
```

## Configurar FTP para Backup

```bash
# Definir credenciais FTP
# ftp set
# User Name: user01
# User Password: user01

(config)# file-server auto-backup configuration primary 10.0.0.100 ftp user
  User Name: user01
  User Password: user01
(config)# auto-backup period configuration enable
(config)# auto-backup period configuration interval 1 time 11:40
```

## Ativar Acesso Web da ONU via CLI

```bash
# diagnose mode
(config)# diagnose
(diagnose)# ont wan-access http 0/1/0 35 enable
```

## Verificar IP da ONU

```bash
(config)# interface gpon 0/1
(config-if-gpon-0/1)# display ont ipconfig 0 35
```

## Reset de ONU para Fábrica

```bash
(config)# interface gpon 0/1
(config-if-gpon-0/1)# ont factory-setting-restore 4 3
```

## Salvar Configuração

```bash
(config)# save
```

---

## Veja Também

- [Device / Gerência — OLT Huawei](./device)
- [Interfaces e VLANs — OLT Huawei](./interface-vlan)
- [GPON — ONUs — OLT Huawei](./gpon-ont)
- [Troubleshooting / Sinal — OLT Huawei](./troubleshooting)
- [Configuração Inicial — OLT Datacom](/pt/olt/datacom/configuracao-inicial)
