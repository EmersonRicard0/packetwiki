---
description: Configuração de SSH, ACL de acesso, interface de gerência e timeout de sessão em switches Huawei CloudEngine e S-series.
---

# Gerência e SSH — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de acesso seguro a switches Huawei via SSH: geração de chaves RSA, configuração das VTYs, restrição de acesso por ACL, interface de gerência in-band e out-of-band, e timeout de sessão.

::: warning Segurança
Evite habilitar Telnet em produção — o protocolo não criptografa credenciais. Use sempre SSH versão 2.
:::

---

## Gerar Chave RSA para SSH

O SSH só funciona após a geração das chaves RSA. Execute este passo antes de habilitar o servidor.

```bash
[SW] rsa local-key-pair create
# Quando solicitado, pressione Enter para aceitar o tamanho 2048
```

---

## Habilitar SSH

```bash
# Habilitar o servidor SSH (stelnet)
[SW] stelnet server enable

# Configurar usuário SSH (o usuário deve existir no AAA)
[SW] ssh user admin
[SW] ssh user admin authentication-type password
[SW] ssh user admin service-type stelnet
```

---

## Configurar VTYs para SSH

```bash
[SW] user-interface vty 0 4
[SW-ui-vty0-4] authentication-mode aaa
[SW-ui-vty0-4] protocol inbound ssh
[SW-ui-vty0-4] user privilege level 15
[SW-ui-vty0-4] idle-timeout 10 0
[SW-ui-vty0-4] quit
```

---

## ACL para Restringir Acesso SSH

Boa prática: permitir SSH apenas da rede de gerência.

```bash
[SW] acl 2000
[SW-acl-basic-2000] rule 5 permit source 10.0.0.0 0.0.0.255
[SW-acl-basic-2000] rule 10 deny source any
[SW-acl-basic-2000] quit

[SW] user-interface vty 0 4
[SW-ui-vty0-4] acl 2000 inbound
[SW-ui-vty0-4] quit
```

---

## Interface de Gerência Out-of-Band (MEth)

Alguns modelos possuem porta dedicada de gerência (MEth), separada do plano de dados.

```bash
[SW] interface MEth 0/0/0
[SW-MEth0/0/0] ip address 10.0.0.1 255.255.255.0
[SW-MEth0/0/0] description Gerencia-OOB
[SW-MEth0/0/0] quit

# Rota padrão para a rede de gerência OOB
[SW] ip route-static 0.0.0.0 0.0.0.0 vpn-instance managementVpn 10.0.0.254
```

---

## Interface de Gerência In-Band (VLANIF)

Quando não há porta OOB, use uma VLANIF dedicada para gerência.

```bash
[SW] vlan 1000
[SW-vlan1000] description Gerencia-Inband
[SW-vlan1000] quit

[SW] interface Vlanif 1000
[SW-Vlanif1000] ip address 172.16.0.1 255.255.255.0
[SW-Vlanif1000] description Gerencia-Inband
[SW-Vlanif1000] quit

# Rota padrão
[SW] ip route-static 0.0.0.0 0.0.0.0 172.16.0.254
```

---

## Timeout de Sessão

```bash
# Timeout VTY: 10 minutos de inatividade
[SW] user-interface vty 0 4
[SW-ui-vty0-4] idle-timeout 10 0
[SW-ui-vty0-4] quit

# Timeout console: 30 minutos
[SW] user-interface console 0
[SW-ui-console0] idle-timeout 30 0
[SW-ui-console0] quit
```

---

## Habilitar Telnet (não recomendado)

Apenas se estritamente necessário em ambientes sem suporte a SSH.

```bash
[SW] telnet server enable
[SW] user-interface vty 0 4
[SW-ui-vty0-4] protocol inbound telnet
[SW-ui-vty0-4] authentication-mode aaa
[SW-ui-vty0-4] quit
```

---

## Verificar SSH e Acesso

```bash
# Estado do servidor SSH
<SW> display ssh server status

# Usuários SSH configurados
<SW> display ssh user-information

# Sessões de usuário ativas
<SW> display users

# VTYs configuradas
<SW> display user-interface vty 0 4
```

---

## Problemas Comuns

### SSH recusa conexão (Connection refused)

```bash
# 1. Confirmar que o servidor SSH está ativo
<SW> display ssh server status
# "SSH Server: Enable" — se "Disable", executar: stelnet server enable

# 2. Confirmar que as VTYs aceitam SSH
<SW> display user-interface vty 0 4
# Deve mostrar: protocol inbound ssh

# 3. Verificar se a ACL não está bloqueando o IP de origem
<SW> display acl 2000
```

### Mensagem "No matching host key type found"

O cliente SSH não tem suporte ao algoritmo de chave do switch. Adicione ao cliente:

```bash
ssh -oHostKeyAlgorithms=+ssh-rsa admin@10.0.0.1
```

Ou regere a chave com algoritmo mais moderno:

```bash
[SW] rsa local-key-pair destroy
[SW] rsa local-key-pair create
```

---

## Veja Também

- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [SNMP — Switch Huawei](./snmp)
- [Log / Syslog — Switch Huawei](./log-syslog)
- [Troubleshooting — Switch Huawei](./troubleshooting)
