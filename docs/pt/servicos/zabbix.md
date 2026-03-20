---
description: Guia completo de instalação do Zabbix Server como serviço systemd no Ubuntu 22.04 — banco de dados, frontend, agente e gerenciamento.
---

# Zabbix — Instalação como Serviço

::: tip Versão testada
**Zabbix 6.4 LTS** no **Ubuntu Server 22.04 LTS**. Para Zabbix 7.x os passos são equivalentes — substituir `6.4` por `7.0` nas URLs do repositório.
:::

O Zabbix é composto por três serviços independentes que rodam via systemd:

| Serviço | Unidade systemd | Função |
|---------|----------------|--------|
| Zabbix Server | `zabbix-server` | Coleta, processa e armazena dados |
| Zabbix Agent 2 | `zabbix-agent2` | Monitora o próprio servidor |
| Apache2 | `apache2` | Serve o frontend web (PHP) |

---

## 1. Pré-requisitos

```bash
# Atualizar o sistema
apt update && apt upgrade -y

# Instalar dependências
apt install -y wget curl gnupg2 software-properties-common
```

---

## 2. Adicionar Repositório Oficial

```bash
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
apt update
```

---

## 3. Instalar Zabbix + MySQL + Apache

```bash
apt install -y \
  zabbix-server-mysql \
  zabbix-frontend-php \
  zabbix-apache-conf \
  zabbix-sql-scripts \
  zabbix-agent2 \
  mysql-server
```

---

## 4. Configurar Banco de Dados

```bash
# Iniciar MySQL e garantir que sobe com o sistema
systemctl enable --now mysql

# Acessar o MySQL como root
mysql -u root -p
```

```sql
-- Dentro do MySQL:
CREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'SenhaZabbix@2024';
GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';
SET GLOBAL log_bin_trust_function_creators = 1;
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Importar schema inicial do Zabbix
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz \
  | mysql --default-character-set=utf8mb4 -u zabbix -p zabbix

# Desabilitar a opção usada apenas durante o import
mysql -u root -p -e "SET GLOBAL log_bin_trust_function_creators = 0;"
```

---

## 5. Configurar o Zabbix Server

```bash
# Editar o arquivo principal de configuração
nano /etc/zabbix/zabbix_server.conf
```

Parâmetros essenciais:

```ini
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=SenhaZabbix@2024

# Ajuste de performance (para ISPs com muitos hosts)
StartPollers=10
StartPingers=5
CacheSize=128M
HistoryCacheSize=64M
TrendCacheSize=32M
```

---

## 6. Configurar o Agente Zabbix (no próprio servidor)

```bash
nano /etc/zabbix/zabbix_agent2.conf
```

```ini
Server=127.0.0.1
ServerActive=127.0.0.1
Hostname=zabbix-server
```

---

## 7. Habilitar e Iniciar os Serviços

```bash
# Habilitar para iniciar automaticamente no boot
systemctl enable zabbix-server zabbix-agent2 apache2

# Iniciar imediatamente
systemctl start zabbix-server zabbix-agent2 apache2

# Confirmar que todos estão rodando
systemctl status zabbix-server zabbix-agent2 apache2
```

Saída esperada para cada serviço:
```
● zabbix-server.service - Zabbix Server
     Loaded: loaded (/lib/systemd/system/zabbix-server.service; enabled)
     Active: active (running) since ...
```

---

## 8. Primeiro Acesso — Configurar via Web

```
http://IP_DO_SERVIDOR/zabbix
```

Siga o wizard de instalação:
1. Verificar pré-requisitos (tudo deve estar ✅)
2. Configurar conexão com banco de dados
3. Definir nome do servidor Zabbix
4. Finalizar e fazer login

```
Usuário padrão: Admin
Senha padrão:   zabbix
```

::: warning Segurança
Troque a senha padrão imediatamente em **User settings → Change password**.
:::

---

## 9. Unidades Systemd — Referência

### Ver status detalhado

```bash
systemctl status zabbix-server
systemctl status zabbix-agent2
```

### Parar / Reiniciar / Recarregar

```bash
# Reiniciar após alterar configuração
systemctl restart zabbix-server

# Recarregar config sem derrubar o serviço (quando suportado)
systemctl reload zabbix-server

# Parar manualmente
systemctl stop zabbix-server

# Iniciar manualmente
systemctl start zabbix-server
```

### Desabilitar / Habilitar inicialização automática

```bash
# Desabilitar o boot automático (sem parar o serviço)
systemctl disable zabbix-server

# Reabilitar
systemctl enable zabbix-server
```

---

## 10. Gerenciamento de Logs

```bash
# Ver log em tempo real (mais útil para debug)
journalctl -u zabbix-server -f

# Ver últimas 100 linhas
journalctl -u zabbix-server -n 100

# Ver logs desde o boot atual
journalctl -u zabbix-server -b

# Filtrar apenas erros
journalctl -u zabbix-server -p err

# Log direto do arquivo
tail -f /var/log/zabbix/zabbix_server.log
grep "ERROR" /var/log/zabbix/zabbix_server.log | tail -30
```

---

## 11. Instalar Agente em Servidores Monitorados

```bash
# Em cada servidor que você quer monitorar:
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
apt update && apt install -y zabbix-agent2

# Configurar
nano /etc/zabbix/zabbix_agent2.conf
# Server=IP_DO_ZABBIX_SERVER
# ServerActive=IP_DO_ZABBIX_SERVER
# Hostname=nome-deste-servidor

systemctl enable --now zabbix-agent2
```

---

## 12. Firewall

```bash
# Liberar porta web (se UFW ativo)
ufw allow 80/tcp
ufw allow 443/tcp

# Porta do agente Zabbix (se receber conexões passivas)
ufw allow 10050/tcp

# Porta do servidor Zabbix (trapper)
ufw allow 10051/tcp
```

---

## Referência Rápida de Serviços

| Ação | Comando |
|------|---------|
| Ver status | `systemctl status zabbix-server` |
| Reiniciar servidor | `systemctl restart zabbix-server` |
| Reiniciar agente | `systemctl restart zabbix-agent2` |
| Ver log ao vivo | `journalctl -u zabbix-server -f` |
| Ver erros recentes | `grep ERROR /var/log/zabbix/zabbix_server.log` |
| Testar SNMP | `snmpwalk -v2c -c public 192.168.1.1 sysDescr` |

---

## Problemas Comuns

### Serviço não inicia — porta em uso

```bash
# Verificar o que está usando a porta 10051
ss -tlnp | grep 10051

# Ver erro detalhado do serviço
journalctl -u zabbix-server -n 50 --no-pager
```

### Frontend não conecta no banco

```bash
# Testar conexão com o banco
mysql -u zabbix -p zabbix -e "SELECT COUNT(*) FROM hosts;"

# Verificar configuração
grep -E "^DB" /etc/zabbix/zabbix_server.conf
```

### Serviço reinicia sozinho (crashloop)

```bash
# Ver quantas vezes reiniciou
systemctl status zabbix-server | grep "restart"

# Ver o motivo do crash
journalctl -u zabbix-server -p err -n 30
```

---

## Veja Também

- [Grafana + Prometheus](/pt/servicos/grafana)
- [SNMP — Roteador Huawei](/pt/roteadores/huawei/snmp)
- [SNMP — Switch Huawei](/pt/switches/huawei/snmp)
- [SNMP — OLT Huawei](/pt/olt/huawei/)
