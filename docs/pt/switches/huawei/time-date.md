---
description: Configuração de data, hora, fuso horário e NTP em switches Huawei CloudEngine e S-series.
---

# Data e Hora / NTP — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de sincronização de tempo em switches Huawei via NTP. Relógio correto é essencial para correlacionar logs, certificados TLS e protocolos como Kerberos. Recomendado: sincronizar com servidores NTP nacionais (NTP.br) e definir o fuso horário antes de qualquer outra configuração.

---

## Configurar Fuso Horário

```bash
# Brasil — UTC-3 (sem horário de verão desde 2019)
[SW] clock timezone BRT minus 03:00:00
```

---

## Ajustar Data e Hora Manualmente

Use apenas quando NTP não estiver disponível:

```bash
<SW> clock datetime 15:30:00 2025-03-19
```

---

## Configurar NTP (Recomendado)

```bash
# Servidores NTP.br — alta disponibilidade para redes brasileiras
[SW] ntp-service unicast-server 200.160.0.8 prefer
[SW] ntp-service unicast-server 200.189.40.8

# Habilitar NTP
[SW] ntp-service enable
```

---

## Interface de Origem NTP

Define de qual IP o switch faz as requisições NTP (útil para filtros de firewall).

```bash
# Via VLANIF de gerência
[SW] ntp-service source-interface Vlanif 10

# Via loopback (mais estável)
[SW] ntp-service source-interface LoopBack 0
```

---

## NTP Master (Switch como Servidor NTP)

Use quando o switch precisar ser a referência de tempo para outros equipamentos da rede:

```bash
# Stratum 5 = servidor local sem fonte externa
[SW] ntp-service refclock-master 5
```

---

## Exemplo Completo

```bash
[SW] clock timezone BRT minus 03:00:00
[SW] ntp-service unicast-server 200.160.0.8 prefer
[SW] ntp-service unicast-server 200.189.40.8
[SW] ntp-service source-interface LoopBack 0
[SW] ntp-service enable
```

---

## Verificar NTP

```bash
# Estado da sincronização NTP
<SW> display ntp-service status

# Sessões NTP ativas
<SW> display ntp-service sessions

# Hora atual do sistema
<SW> display clock
```

### Saída esperada do `display ntp-service status`

```
Clock status: synchronized
Clock stratum: 3
Reference clock ID: 200.160.0.8
Nominal frequency: 250.0000 Hz
```

Se `Clock status: unsynchronized`, o NTP ainda não convergiu ou há problema de conectividade.

---

## Problemas Comuns

### NTP não sincroniza (unsynchronized)

```bash
# 1. Verificar conectividade com o servidor NTP
<SW> ping 200.160.0.8

# 2. Verificar se há alguma sessão NTP
<SW> display ntp-service sessions
# Se vazio, o pacote NTP não está chegando ao servidor

# 3. Verificar se a interface de origem está UP
<SW> display interface LoopBack 0

# 4. Aguardar — NTP pode demorar 5-10 minutos para sincronizar na primeira vez
```

### Logs com horário errado mesmo após configurar NTP

```bash
# Confirmar fuso horário
<SW> display clock
# Hora deve refletir UTC-3 para o Brasil

# Se o fuso não estiver configurado, reconfigurar
[SW] clock timezone BRT minus 03:00:00
```

---

## Veja Também

- [Log / Syslog — Switch Huawei](./log-syslog)
- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [SNMP — Switch Huawei](./snmp)
