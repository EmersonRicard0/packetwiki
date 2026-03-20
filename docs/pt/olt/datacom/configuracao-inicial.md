---
description: Configuração inicial da OLT Datacom DM4615/DM4610 — acesso console, usuário, gerência, SSH, SNMP, NTP e syslog.
---

# Configuração Inicial — OLT Datacom

::: tip Versão testada
DmOS **21.1** (DM4615 / DM4610). Compatível com DmOS 19.x+.
:::

Guia para a primeira configuração de OLTs Datacom. A CLI é baseada em IOS-like (Cisco style), com modos `enable` → `configure terminal`. Siga esta sequência antes de qualquer configuração GPON ou de serviços.

---

## Acesso via Console

Parâmetros da porta serial:

| Parâmetro | Valor |
|-----------|-------|
| Velocidade | 115200 bps |
| Bits de dados | 8 |
| Paridade | Nenhuma |
| Bits de parada | 1 |
| Controle de fluxo | Nenhum |

### Credenciais de Fábrica

| Parâmetro | Padrão de fábrica |
|-----------|------------------|
| Usuário | `admin` |
| Senha | `admin` |

::: warning
Altere a senha padrão imediatamente após o primeiro acesso.
:::

---

## Navegação na CLI

```bash
# Entrar no modo privilegiado
DM> enable

# Entrar no modo de configuração global
DM# configure terminal

# Sair do modo atual (um nível acima)
DM(config)# exit

# Voltar direto para modo privilegiado
DM(config-if)# end

# Ajuda contextual
DM# ?
DM# show ?
DM(config)# interface ?
```

---

## Hostname e Domínio

```bash
DM(config)# hostname DM4615-POP01
DM4615-POP01(config)# ip domain-name provedor.com.br
```

---

## Usuários e Senhas

```bash
# Criar usuário com privilégio máximo
DM(config)# username admin privilege 15 secret SenhaForte@123

# Senha de enable (modo privilegiado)
DM(config)# enable secret SenhaEnable@123

# Remover usuário antigo
DM(config)# no username usuario_antigo
```

---

## Interface de Gerência (IP de Gerência)

```bash
# Interface de gerência out-of-band
DM(config)# interface management 0
DM(config-if)# ip address 192.168.1.10 255.255.255.0
DM(config-if)# no shutdown
DM(config-if)# exit

# Rota padrão para gerência
DM(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.1
```

---

## SSH

```bash
# Gerar chave RSA para SSH
DM(config)# crypto key generate rsa modulus 2048

# Habilitar SSH versão 2
DM(config)# ip ssh version 2

# Configurar timeout e tentativas máximas
DM(config)# ip ssh time-out 60
DM(config)# ip ssh authentication-retries 3
```

---

## SNMP

```bash
# SNMPv2c — somente leitura
DM(config)# snmp-server community public ro

# SNMPv2c — leitura/escrita (restrito ao host de gerência)
DM(config)# snmp-server community private rw

# Enviar traps para o servidor de monitoramento
DM(config)# snmp-server host 10.0.0.5 traps version 2c public

# SNMPv3 com autenticação e privacidade
DM(config)# snmp-server user admin SNMPv3-group v3 auth sha SenhaAuth@123 priv aes 128 SenhaPriv@456
```

---

## NTP

```bash
# Servidores NTP (NTP.br)
DM(config)# ntp server 200.160.7.186
DM(config)# ntp server 200.20.186.76

# Fuso horário Brasil (UTC-3)
DM(config)# clock timezone BRT -3
```

---

## Syslog

```bash
# Servidor de logs centralizado
DM(config)# logging host 10.0.0.100
DM(config)# logging facility local6
DM(config)# logging level informational
```

---

## Salvar Configuração

```bash
# Salvar na memória não-volátil
DM# write memory

# Alternativa
DM# copy running-config startup-config
```

---

## Verificar Status

```bash
DM# show version
DM# show running-config
DM# show interface management 0
DM# show users
DM# show ntp status
DM# show clock
```

---

## Problemas Comuns

### SSH não conecta após configuração

```bash
# Verificar se a chave RSA foi gerada
DM# show crypto key mypubkey rsa

# Se não existir, regerar
DM(config)# crypto key generate rsa modulus 2048

# Confirmar versão SSH ativa
DM# show ip ssh

# Verificar se a interface de gerência está UP
DM# show interface management 0
```

### IP de gerência sem resposta a ping

```bash
# Verificar configuração da interface
DM# show interface management 0

# Verificar rota padrão
DM# show ip route 0.0.0.0

# Verificar ARP
DM# show arp
```

### Hora do sistema incorreta

```bash
# Verificar status NTP
DM# show ntp status
# Esperado: "Clock is synchronized"

# Verificar associações NTP
DM# show ntp associations

# Se não sincronizar, verificar conectividade com o servidor NTP
DM# ping 200.160.7.186
```

---

## Veja Também

- [Perfis GPON — OLT Datacom](./gpon-perfis)
- [Provisionamento de ONUs — OLT Datacom](./gpon-provisionamento)
- [Serviços GPON — OLT Datacom](./gpon-servicos)
- [MPLS / VPLS — OLT Datacom](./mpls-vpls)
- [Configuração Inicial — OLT Huawei](/pt/olt/huawei/configuracao-inicial)
