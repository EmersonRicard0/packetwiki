---
description: Configuração de SNMP v2c e v3 no roteador Huawei NE — community, traps, ACL e integração com Zabbix.
---

# SNMP — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Guia de configuração de SNMP para monitoramento de roteadores Huawei NE. Inclui SNMPv2c para compatibilidade legada e SNMPv3 com autenticação SHA e criptografia AES128 (recomendado para produção). Lembre-se de executar `commit` após cada bloco de configuração.

::: warning
Restrinja o acesso SNMP com ACL — use SNMPv3 sempre que possível, pois o v2c expõe a community string em texto claro.
:::

---

## SNMP v2c

```bash
[PE01] snmp-agent
[PE01] snmp-agent community read cipher Gerencia@2024
[PE01] snmp-agent sys-info version v2c
[PE01] snmp-agent sys-info contact NOC-EMPRESA
[PE01] snmp-agent sys-info location Datacenter-01
[PE01] commit
```

---

## SNMP v3 (Recomendado)

```bash
[PE01] snmp-agent
[PE01] snmp-agent group v3 GRUPO-MON privacy read-view iso
[PE01] snmp-agent usm-user v3 snmp-monitor GRUPO-MON
[PE01] snmp-agent usm-user v3 snmp-monitor authentication-mode sha cipher Auth@Pass2024
[PE01] snmp-agent usm-user v3 snmp-monitor privacy-mode aes128 cipher Priv@Pass2024
[PE01] commit
```

---

## Traps / Notificações

```bash
[PE01] snmp-agent trap enable
[PE01] snmp-agent target-host trap address udp-domain 10.0.0.100 params securityname Gerencia@2024
# Usar loopback como origem para garantir alcançabilidade
[PE01] snmp-agent trap source LoopBack 0
[PE01] commit
```

---

## Restrição por ACL

```bash
[PE01] acl 2001
[PE01-acl-basic-2001] rule 5 permit source 10.0.0.0 0.0.0.255
[PE01-acl-basic-2001] rule 100 deny source any
[PE01-acl-basic-2001] quit
[PE01] snmp-agent community read cipher Gerencia@2024 acl 2001
[PE01] commit
```

---

## Verificar SNMP

```bash
# Estado geral do agente
<PE01> display snmp-agent status

# Communities v2c configuradas
<PE01> display snmp-agent community

# Usuários SNMPv3
<PE01> display snmp-agent usm-user

# Traps habilitados e destinos
<PE01> display snmp-agent trap all
```

---

## Problemas Comuns

### Zabbix não coleta dados do roteador

```bash
# 1. Confirmar que SNMP está ativo
<PE01> display snmp-agent status

# 2. Testar do servidor Zabbix (Linux):
snmpwalk -v2c -c Gerencia@2024 10.255.1.1 1.3.6.1.2.1.1.1.0
# SNMPv3:
snmpget -v3 -u snmp-monitor -l authPriv -a SHA -A Auth@Pass2024 -x AES -X Priv@Pass2024 10.255.1.1 1.3.6.1.2.1.1.1.0

# 3. Verificar ACL (se o IP do Zabbix está permitido)
<PE01> display acl 2001

# 4. Confirmar que as mudanças foram confirmadas
[PE01] display configuration candidate
```

### Traps não chegam ao servidor

```bash
# Verificar destino e origem
<PE01> display snmp-agent trap all

# Verificar conectividade com o servidor de traps
<PE01> ping -a 10.255.1.1 10.0.0.100
```

---

## Veja Também

- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [Zabbix — Instalação e Configuração](/pt/servicos/zabbix)
- [SNMP — Switch Huawei](/pt/switches/huawei/snmp)
