---
description: Configuração de log e syslog em switches Huawei — servidor remoto, níveis de severidade, módulos e buffer local.
---

# Log / Syslog — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de configuração de logging centralizado em switches Huawei. Cobre envio para servidor syslog remoto, configuração de severidade por módulo, buffer local e habilitação de timestamps para facilitar correlação de eventos.

---

## Configurar Servidor Syslog Remoto

```bash
# Habilitar o info-center (necessário para todos os logs)
[SW] info-center enable

# Definir servidor syslog
[SW] info-center loghost 10.0.0.100

# Definir facility e interface de origem
[SW] info-center loghost 10.0.0.100 facility local7
[SW] info-center loghost source Vlanif 10
```

---

## Níveis de Severidade

| Nível | Valor | Descrição |
|-------|-------|-----------|
| emergencies | 0 | Sistema inutilizável |
| alerts | 1 | Ação imediata necessária |
| critical | 2 | Condição crítica |
| errors | 3 | Condições de erro |
| warnings | 4 | Avisos (padrão recomendado) |
| notifications | 5 | Eventos normais importantes |
| informational | 6 | Mensagens informativas |
| debugging | 7 | Debug (muito verboso) |

```bash
# Enviar apenas warnings e acima para o syslog
[SW] info-center source default channel 2 log level warnings
```

---

## Habilitar Log por Módulo

Para obter mais detalhe de protocolos específicos sem habilitar debugging global:

```bash
[SW] info-center source OSPF channel 2 log level informational
[SW] info-center source BGP channel 2 log level informational
[SW] info-center source SSH channel 2 log level informational
[SW] info-center source AAA channel 2 log level informational
```

---

## Timestamp nos Logs

```bash
# Formato de data completo: YYYY/MM/DD HH:MM:SS
[SW] info-center timestamp log date
```

---

## Buffer Local de Log

O buffer local armazena mensagens recentes sem depender de conectividade com servidor externo.

```bash
# Aumentar tamanho do buffer (padrão: 512, máximo: 10240)
[SW] info-center logbuffer size 1024

# Visualizar buffer local
<SW> display logbuffer

# Filtrar por severidade
<SW> display logbuffer level warnings

# Limpar buffer
<SW> reset logbuffer
```

---

## Log no Terminal (Sessão Atual)

Útil durante troubleshooting para ver mensagens em tempo real na CLI.

```bash
[SW] terminal logging
[SW] terminal monitor
```

---

## Exemplo Completo

Configuração típica para produção com servidor Zabbix/Graylog:

```bash
[SW] info-center enable
[SW] info-center loghost 10.11.104.100
[SW] info-center loghost source Vlanif 1000
[SW] info-center source default channel 2 log level informational
[SW] info-center timestamp log date
[SW] info-center logbuffer size 1024
```

---

## Verificar Configuração de Log

```bash
# Estado geral do info-center
<SW> display info-center

# Servidores syslog configurados
<SW> display loghost

# Conteúdo do buffer local
<SW> display logbuffer
```

---

## Problemas Comuns

### Logs não chegam ao servidor syslog

```bash
# 1. Verificar se o info-center está habilitado
<SW> display info-center
# "Information Center: enabled"

# 2. Confirmar endereço do servidor e interface de origem
<SW> display loghost

# 3. Verificar conectividade com o servidor
<SW> ping -a 172.16.0.1 10.0.0.100

# 4. Confirmar que o nível está correto (não muito restritivo)
<SW> display info-center
```

### Mensagens com horário incorreto

```bash
# Verificar hora do sistema
<SW> display clock

# Configurar NTP
[SW] ntp-service unicast-server 200.160.7.186
[SW] clock timezone BRT minus 03:00:00
```

---

## Veja Também

- [Gerência e SSH — Switch Huawei](./gerencia-ssh)
- [SNMP — Switch Huawei](./snmp)
- [Data e Hora / NTP — Switch Huawei](./time-date)
- [Troubleshooting — Switch Huawei](./troubleshooting)
