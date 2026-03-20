---
description: Backup e restore de configuração em switches Huawei via save, TFTP, FTP, SFTP e agendamento automático.
---

# Backup e Restore — Switch Huawei

::: tip Versão testada
VRP **V200R019C10** (CloudEngine 6800 / S5700 / S6700). Compatível com V200R005+.
:::

Guia de backup e restauração de configuração em switches Huawei. Cobre salvamento local, transferência via TFTP/FTP/SFTP para servidor externo, restauração e agendamento automático de backup.

::: warning Antes de qualquer manutenção
Sempre faça backup antes de alterações significativas. Confirme o arquivo de startup (`display startup`) para saber qual configuração será carregada no próximo boot.
:::

---

## Salvar Configuração Localmente

```bash
# Salvar no arquivo de startup padrão
<SW> save
# Confirmar com "y"

# Salvar em arquivo com nome específico (mantém cópias)
<SW> save flash:/config-backup-2025.cfg
```

---

## Backup via TFTP

TFTP é o método mais simples — não requer autenticação.

```bash
# Enviar configuração para servidor TFTP
<SW> tftp 10.0.0.100 put vrpcfg.zip SW-CORE-backup.zip
```

---

## Backup via FTP

```bash
# Habilitar servidor FTP local (para receber conexões)
[SW] ftp server enable

# Enviar para servidor FTP externo
<SW> ftp 10.0.0.100
[ftp] put vrpcfg.zip SW-CORE-backup.zip
[ftp] quit
```

---

## Backup via SFTP (Recomendado)

SFTP usa SSH — credenciais e dados trafegam criptografados.

```bash
<SW> sftp 10.0.0.100
[sftp] put vrpcfg.zip SW-CORE-2025.zip
[sftp] quit
```

---

## Restaurar Configuração via TFTP

```bash
# 1. Baixar o arquivo de backup para o switch
<SW> tftp 10.0.0.100 get SW-CORE-backup.zip vrpcfg.zip

# 2. Definir o arquivo como startup
<SW> startup saved-configuration vrpcfg.zip

# 3. Reiniciar (confirmar quando solicitado)
<SW> reboot
```

---

## Restaurar via FTP

```bash
<SW> ftp 10.0.0.100
[ftp] get SW-CORE-backup.zip vrpcfg.zip
[ftp] quit
<SW> startup saved-configuration vrpcfg.zip
<SW> reboot
```

---

## Verificar Arquivos no Flash

```bash
# Listar todos os arquivos no flash
<SW> dir flash:

# Ver arquivo de startup atual e próximo boot
<SW> display startup

# Definir manualmente o arquivo de startup
<SW> startup saved-configuration flash:/config-backup-2025.cfg
```

---

## Comparar Configuração em Memória x Salva

```bash
# Ver configuração ativa (em memória)
<SW> display current-configuration

# Ver configuração salva (que será usada no boot)
<SW> display saved-configuration
```

---

## Agendamento de Backup Automático

Salva automaticamente a configuração às 02h da manhã:

```bash
[SW] schedule job save-auto
[SW-schedule-job-save-auto] time-range daily 02:00:00
[SW-schedule-job-save-auto] command save
[SW-schedule-job-save-auto] quit
```

Para verificar jobs agendados:

```bash
<SW> display schedule job
```

---

## Problemas Comuns

### TFTP falha ao transferir

```bash
# 1. Verificar conectividade com o servidor TFTP
<SW> ping 10.0.0.100

# 2. Confirmar que o servidor TFTP está rodando e com permissão de escrita
# (verificar no servidor)

# 3. Verificar espaço livre no flash
<SW> dir flash:
```

### Configuração não carrega após restore + reboot

```bash
# Confirmar que o arquivo de startup está correto
<SW> display startup
# "Startup saved-configuration file" deve apontar para o arquivo restaurado

# Se não estiver, redefinir
<SW> startup saved-configuration vrpcfg.zip
```

---

## Veja Também

- [Configuração Inicial — Switch Huawei](./configuracao-inicial)
- [Gerência e SSH — Switch Huawei](./gerencia-ssh)
- [Troubleshooting — Switch Huawei](./troubleshooting)
- [Backup — Roteador Huawei](/pt/roteadores/huawei/backup)
