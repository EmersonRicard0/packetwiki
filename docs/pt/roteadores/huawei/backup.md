---
description: Backup e restore de configuração no roteador Huawei NE via save, FTP, TFTP, SFTP e agendamento automático.
---

# Backup de Configuração — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Guia de backup e restauração de configuração em roteadores Huawei NE. Cobre salvamento local, transferência via TFTP/FTP/SFTP e agendamento automático. Execute um backup antes de qualquer manutenção significativa.

::: warning Antes de alterar produção
Faça backup da configuração atual **antes** de qualquer mudança. No NE, o `save` grava a configuração candidata confirmada — não a pendente.
:::

---

## Salvar Configuração Localmente

```bash
<PE01> save
# Confirmar com "y"
```

---

## Backup via TFTP

```bash
<PE01> tftp 10.0.0.100 put vrpcfg.zip PE01-backup.zip
```

---

## Backup via FTP

```bash
<PE01> ftp 10.0.0.100
[ftp] put vrpcfg.zip PE01-backup-2025.zip
[ftp] quit
```

---

## Backup via SFTP (Recomendado)

SFTP criptografa credenciais e dados:

```bash
<PE01> sftp 10.0.0.100
[sftp] put vrpcfg.zip PE01-backup.zip
[sftp] quit
```

---

## Restaurar Configuração

```bash
# 1. Baixar o arquivo de backup para o roteador
<PE01> ftp 10.0.0.100
[ftp] get PE01-backup.zip vrpcfg.zip
[ftp] quit

# 2. Definir o arquivo como startup
<PE01> startup saved-configuration vrpcfg.zip

# 3. Reiniciar para aplicar (confirmar quando solicitado)
<PE01> reboot
```

---

## Verificar Arquivos no Sistema

```bash
# Listar arquivos
<PE01> dir

# Ver arquivo de startup atual
<PE01> display startup
```

---

## Backup Automático Agendado

Backup TFTP diário às 02h da manhã:

```bash
[PE01] schedule job daily-backup
[PE01-schedule-job-daily-backup] time-range daily 02:00:00
[PE01-schedule-job-daily-backup] command tftp 10.0.0.100 put vrpcfg.zip PE01-auto-backup.zip
[PE01-schedule-job-daily-backup] quit
[PE01] commit
```

Verificar jobs agendados:

```bash
<PE01> display schedule job
```

---

## Problemas Comuns

### Erro ao transferir via TFTP

```bash
# Verificar conectividade com o servidor
<PE01> ping 10.0.0.100

# Verificar espaço disponível
<PE01> dir

# Se o servidor TFTP não responder, tentar FTP/SFTP como alternativa
```

### Configuração não carrega após restore + reboot

```bash
# Confirmar que o arquivo de startup está correto
<PE01> display startup
# O campo "Startup saved-configuration file" deve apontar para o arquivo restaurado

# Se necessário, redefinir
<PE01> startup saved-configuration vrpcfg.zip
```

---

## Veja Também

- [Configuração Inicial — Roteador Huawei](./configuracao-inicial)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [Backup e Restore — Switch Huawei](/pt/switches/huawei/backup-restore)
