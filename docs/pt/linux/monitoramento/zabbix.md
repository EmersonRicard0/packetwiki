---
description: Instalação e configuração do Zabbix Server no Ubuntu/Debian para monitoramento de redes e servidores.
---

# Zabbix — Monitoramento de Redes

::: tip Versão testada
**Zabbix 6.4 LTS** no Ubuntu Server 22.04 LTS. Para Zabbix 7.x os passos são equivalentes.
:::

O Zabbix é a solução de monitoramento mais usada em ISPs brasileiros — monitora roteadores, switches, OLTs, servidores e links via SNMP, ICMP, agente e HTTP.

---

## Instalação — Ubuntu 22.04

### 1. Adicionar repositório oficial

```bash
wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu22.04_all.deb
dpkg -i zabbix-release_6.4-1+ubuntu22.04_all.deb
apt update
```

### 2. Instalar componentes

```bash
apt install -y zabbix-server-mysql zabbix-frontend-php \
               zabbix-apache-conf zabbix-sql-scripts \
               zabbix-agent mysql-server
```

### 3. Configurar banco de dados

```bash
# Criar banco e usuário
mysql -u root -p << 'EOF'
CREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'SenhaZabbix2024!';
GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';
FLUSH PRIVILEGES;
EOF

# Importar schema
zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql -u zabbix -p zabbix
```

### 4. Configurar Zabbix Server

```bash
# Editar /etc/zabbix/zabbix_server.conf
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=SenhaZabbix2024!
```

```bash
sed -i 's/# DBPassword=/DBPassword=SenhaZabbix2024!/' /etc/zabbix/zabbix_server.conf
```

### 5. Iniciar serviços

```bash
systemctl restart zabbix-server zabbix-agent apache2
systemctl enable zabbix-server zabbix-agent apache2
```

### 6. Acessar interface web

```
http://IP_DO_SERVIDOR/zabbix
Usuário: Admin
Senha:   zabbix
```

::: warning
Troque a senha padrão imediatamente após o primeiro acesso.
:::

---

## Monitorar Equipamentos via SNMP

### Adicionar host com SNMP v2c

Na interface web:
1. **Configuration → Hosts → Create host**
2. Preencher **Host name** e **IP address**
3. Na aba **Templates**, adicionar o template adequado:
   - `Template Net Huawei VRP SNMP` (roteadores/switches Huawei)
   - `Template Net Cisco IOS SNMP`
   - `Template Net MikroTik SNMP`
4. Na aba **Interfaces**, adicionar interface SNMP:
   - Type: `SNMP`
   - IP: IP do equipamento
   - SNMP version: `SNMPv2`
   - Community: `public` (ou a community configurada no equipamento)

---

## Monitorar com Agente Zabbix

### Instalar agente no servidor Linux monitorado

```bash
# Ubuntu/Debian
apt install -y zabbix-agent2

# Configurar /etc/zabbix/zabbix_agent2.conf
Server=IP_DO_ZABBIX_SERVER
ServerActive=IP_DO_ZABBIX_SERVER
Hostname=nome-do-host

systemctl restart zabbix-agent2
systemctl enable zabbix-agent2
```

---

## Alertas por E-mail

```bash
# Em Administration → Media types → Email
# SMTP server: smtp.gmail.com
# Port: 587
# SMTP helo: gmail.com
# Connection security: STARTTLS
# Authentication: Username + App Password
```

---

## Comandos Úteis

```bash
# Ver log do servidor
tail -f /var/log/zabbix/zabbix_server.log

# Testar conectividade SNMP manualmente
snmpwalk -v2c -c public 192.168.1.1 sysDescr

# Verificar status do serviço
systemctl status zabbix-server

# Ver quantidade de hosts monitorados
mysql -u zabbix -p zabbix -e "SELECT COUNT(*) FROM hosts WHERE status=0;"
```

---

## Problemas Comuns

### Frontend acessível mas servidor não coleta

```bash
# Verificar se o serviço está rodando
systemctl status zabbix-server

# Ver últimos erros
grep "ERROR" /var/log/zabbix/zabbix_server.log | tail -20

# Verificar conexão com banco
mysql -u zabbix -p zabbix -e "SELECT 1"
```

### Host com status "Not available" via SNMP

```bash
# Testar SNMP manualmente do servidor Zabbix
snmpget -v2c -c public IP_DO_HOST sysUpTime.0

# Verificar firewall no host monitorado (UDP 161)
ufw status
```

---

## Veja Também

- [Grafana + Prometheus](/pt/linux/monitoramento/grafana)
- [SNMP — Roteador Huawei](/pt/roteadores/huawei/snmp)
- [SNMP — Switch Huawei](/pt/switches/huawei/snmp)
