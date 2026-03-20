---
description: Configuração de SNMP v2c e v3 em switches Huawei — community, traps, ACL e verificação para integração com Zabbix/Grafana.
---

# SNMP — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de SNMP para monitoramento de switches Huawei. Cobre SNMPv2c para compatibilidade legada e SNMPv3 com autenticação e privacidade (recomendado para produção). Inclui restrição de acesso por ACL e configuração de traps.

::: warning Segurança
Use SNMPv3 sempre que possível — SNMPv2c transmite a community string em texto claro. Restrinja o acesso SNMP com ACL para a rede de gerência.
:::

---

## SNMP v2c (Leitura)

```bash
# Habilitar agente SNMP
[SW] snmp-agent

# Community de leitura (cifrada no VRP)
[SW] snmp-agent community read cipher Gerencia@2024

# Versão e informações do sistema
[SW] snmp-agent sys-info version v2c
[SW] snmp-agent sys-info contact NOC-EMPRESA
[SW] snmp-agent sys-info location Datacenter-01
```

---

## SNMP v2c com Trap

```bash
# Habilitar envio de traps
[SW] snmp-agent trap enable

# Definir destino dos traps
[SW] snmp-agent target-host trap address udp-domain 10.0.0.100 params securityname Gerencia@2024
```

---

## SNMP v3 (Recomendado)

SNMPv3 oferece autenticação (SHA) e criptografia (AES128) das mensagens.

```bash
# Criar grupo SNMPv3 com leitura e escrita
[SW] snmp-agent group v3 GRUPO-MON privacy read-view iso write-view iso

# Criar usuário com autenticação SHA e privacidade AES128
[SW] snmp-agent usm-user v3 monitor-user GRUPO-MON
[SW] snmp-agent usm-user v3 monitor-user authentication-mode sha cipher Auth@Pass2024
[SW] snmp-agent usm-user v3 monitor-user privacy-mode aes128 cipher Priv@Pass2024
```

---

## Restringir Acesso SNMP por ACL

```bash
# ACL: permitir apenas a rede de gerência
[SW] acl 2001
[SW-acl-basic-2001] rule 5 permit source 10.0.0.0 0.0.0.255
[SW-acl-basic-2001] rule 100 deny source any
[SW-acl-basic-2001] quit

# Aplicar ACL na community v2c
[SW] snmp-agent community read cipher Gerencia@2024 acl 2001
```

---

## Interface de Origem dos Traps

Garante que os traps saiam sempre com o mesmo IP (loopback ou VLANIF de gerência).

```bash
# Usar VLANIF de gerência como origem
[SW] snmp-agent trap source Vlanif 10

# Ou usar loopback (mais estável)
[SW] snmp-agent trap source LoopBack 0
```

---

## Exemplo Completo — SNMPv3 para Zabbix

```bash
[SW] snmp-agent
[SW] snmp-agent sys-info version v3
[SW] snmp-agent sys-info contact NOC
[SW] snmp-agent sys-info location POP-01

[SW] snmp-agent group v3 ZABBIX-GRP privacy read-view iso
[SW] snmp-agent usm-user v3 zabbix ZABBIX-GRP
[SW] snmp-agent usm-user v3 zabbix authentication-mode sha cipher ZabbixAuth@2024
[SW] snmp-agent usm-user v3 zabbix privacy-mode aes128 cipher ZabbixPriv@2024

[SW] acl 2001
[SW-acl-basic-2001] rule 5 permit source 10.0.0.100 0.0.0.0
[SW-acl-basic-2001] rule 100 deny source any
[SW-acl-basic-2001] quit

[SW] snmp-agent trap source LoopBack 0
```

---

## Verificar SNMP

```bash
# Estado geral do agente SNMP
<SW> display snmp-agent status

# Communities configuradas
<SW> display snmp-agent community

# Usuários SNMPv3
<SW> display snmp-agent usm-user

# Traps habilitados e destinos
<SW> display snmp-agent trap all
```

---

## Problemas Comuns

### Zabbix não recebe dados SNMP

```bash
# 1. Confirmar que o agente SNMP está ativo
<SW> display snmp-agent status
# "SNMP Agent: Enable"

# 2. Verificar versão e community/usuário
<SW> display snmp-agent community
<SW> display snmp-agent usm-user

# 3. Testar do servidor Zabbix (Linux)
snmpwalk -v2c -c Gerencia@2024 10.0.0.1 1.3.6.1.2.1.1.1.0
# SNMPv3:
snmpget -v3 -u zabbix -l authPriv -a SHA -A ZabbixAuth@2024 -x AES -X ZabbixPriv@2024 10.0.0.1 1.3.6.1.2.1.1.1.0

# 4. Verificar ACL
<SW> display acl 2001
```

### Traps não chegam ao servidor

```bash
# Verificar configuração de destino
<SW> display snmp-agent trap all

# Confirmar conectividade com o servidor de traps
<SW> ping 10.0.0.100

# Verificar interface de origem dos traps
<SW> display snmp-agent trap source
```

---

## Veja Também

- [Gerência e SSH — Switch Huawei](./gerencia-ssh)
- [Log / Syslog — Switch Huawei](./log-syslog)
- [Troubleshooting — Switch Huawei](./troubleshooting)
- [Zabbix — Instalação e Configuração](/pt/servicos/zabbix)
