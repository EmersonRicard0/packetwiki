---
description: Instalação e configuração do FreeRADIUS como serviço systemd — autenticação PPPoE para ISPs com backend MySQL.
---

# FreeRADIUS — Autenticação PPPoE

::: tip Versão testada
**FreeRADIUS 3.2.x** no Ubuntu 22.04 LTS com backend MySQL.
:::

FreeRADIUS é o servidor RADIUS mais usado em ISPs brasileiros para autenticação PPPoE. Recebe requisições do BNG/NAS (roteador concentrador), consulta o banco de dados e responde com aceite/rejeita + políticas de banda.

---

## Arquitetura

```
Cliente PPPoE
    │
    ▼
BNG / NAS (Huawei, MikroTik CCR)  ──► FreeRADIUS (porta UDP 1812/1813)
                                              │
                                              ▼
                                         MySQL / MariaDB
                                    (usuários, senhas, planos)
```

---

## 1. Instalar FreeRADIUS + MySQL

```bash
apt install -y freeradius freeradius-mysql mysql-server

# Confirmar versão instalada
freeradius -v
```

---

## 2. Configurar Banco de Dados

```bash
# Criar banco e usuário
mysql -u root -p << 'EOF'
CREATE DATABASE radius CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'radius'@'localhost' IDENTIFIED BY 'SenhaRadius@2024';
GRANT ALL PRIVILEGES ON radius.* TO 'radius'@'localhost';
FLUSH PRIVILEGES;
EOF

# Importar schema do FreeRADIUS
mysql -u radius -p radius < /etc/freeradius/3.0/mods-config/sql/main/mysql/schema.sql
```

---

## 3. Habilitar Módulo SQL

```bash
# Ativar módulo SQL (criar symlink)
ln -s /etc/freeradius/3.0/mods-available/sql \
       /etc/freeradius/3.0/mods-enabled/sql

# Editar configuração do módulo SQL
nano /etc/freeradius/3.0/mods-enabled/sql
```

Parâmetros a ajustar:

```
dialect     = "mysql"
server      = "localhost"
port        = 3306
login       = "radius"
password    = "SenhaRadius@2024"
radius_db   = "radius"
```

---

## 4. Configurar o Virtual Server Default

```bash
nano /etc/freeradius/3.0/sites-enabled/default
```

Nas seções `authorize`, `accounting` e `session`, garantir que `sql` está habilitado (sem o `#`):

```
authorize {
    ...
    sql
    ...
}

accounting {
    ...
    sql
    ...
}

session {
    sql
}
```

---

## 5. Configurar o NAS (BNG/Roteador)

```bash
nano /etc/freeradius/3.0/clients.conf
```

```
# Adicionar o BNG como cliente RADIUS
client BNG-PRINCIPAL {
    ipaddr      = 192.168.1.1        # IP do roteador BNG
    secret      = SegredoRadius123   # deve ser igual no BNG
    shortname   = bng-principal
    nas_type    = other
}

# Ou uma faixa de IPs (múltiplos BNGs)
client rede-bng {
    ipaddr      = 192.168.1.0/24
    secret      = SegredoRadius123
}
```

---

## 6. Serviço systemd

```bash
# Testar configuração antes de iniciar
freeradius -XC

# Habilitar e iniciar
systemctl enable --now freeradius
systemctl status freeradius
```

### Gerenciar o serviço

```bash
# Reiniciar após alterar configuração
systemctl restart freeradius

# Recarregar sem derrubar sessões ativas
systemctl reload freeradius

# Ver log em tempo real
journalctl -u freeradius -f

# Debug detalhado (parar o serviço antes)
systemctl stop freeradius
freeradius -X
```

---

## 7. Adicionar Usuários PPPoE

### Diretamente no banco MySQL

```sql
-- Adicionar usuário com senha
INSERT INTO radcheck (username, attribute, op, value)
VALUES ('cliente001', 'Cleartext-Password', ':=', 'senha123');

-- Definir plano (velocidade via reply attributes)
INSERT INTO radreply (username, attribute, op, value)
VALUES ('cliente001', 'Mikrotik-Rate-Limit', ':=', '10M/10M');

-- Adicionar ao grupo
INSERT INTO radusergroup (username, groupname, priority)
VALUES ('cliente001', 'plano-10m', 1);
```

### Criar grupo com políticas de banda

```sql
-- Grupo com Huawei BNG (CAR policy)
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES
  ('plano-10m', 'Huawei-Input-Average-Rate',  ':=', '10240'),
  ('plano-10m', 'Huawei-Output-Average-Rate', ':=', '10240'),
  ('plano-10m', 'Session-Timeout',            ':=', '86400');

-- Grupo com MikroTik Rate-Limit
INSERT INTO radgroupreply (groupname, attribute, op, value)
VALUES ('plano-10m-mt', 'Mikrotik-Rate-Limit', ':=', '10M/10M');
```

---

## 8. Testar Autenticação

```bash
# Testar localmente (sem NAS)
radtest cliente001 senha123 127.0.0.1 0 testing123

# Resposta esperada (sucesso):
# Received Access-Accept Id 0 from 127.0.0.1:1812

# Resposta de falha:
# Received Access-Reject
```

---

## 9. Accounting — Contabilização de Sessões

O FreeRADIUS registra início, atualização e fim de cada sessão PPPoE na tabela `radacct`:

```sql
-- Ver sessões ativas
SELECT username, nasipaddress, framedipaddress,
       acctstarttime, acctsessiontime
FROM radacct
WHERE acctstoptime IS NULL
ORDER BY acctstarttime DESC;

-- Ver histórico de um usuário
SELECT username, acctstarttime, acctstoptime,
       acctinputoctets, acctoutputoctets
FROM radacct
WHERE username = 'cliente001'
ORDER BY acctstarttime DESC
LIMIT 10;
```

---

## Referência Rápida de Serviço

| Ação | Comando |
|------|---------|
| Status | `systemctl status freeradius` |
| Reiniciar | `systemctl restart freeradius` |
| Debug | `systemctl stop freeradius && freeradius -X` |
| Testar auth | `radtest USER SENHA 127.0.0.1 0 testing123` |
| Log ao vivo | `journalctl -u freeradius -f` |
| Testar config | `freeradius -XC` |

---

## Problemas Comuns

### Access-Reject sem motivo claro

```bash
# Debug detalhado mostra o motivo linha a linha
systemctl stop freeradius
freeradius -X
# Tentar autenticar e ver o output
```

### NAS não consegue alcançar o RADIUS

```bash
# Verificar se o serviço está escutando
ss -ulnp | grep 1812

# Verificar firewall
ufw allow from 192.168.1.1 to any port 1812 proto udp
ufw allow from 192.168.1.1 to any port 1813 proto udp
```

### Erro de conexão com banco MySQL

```bash
# Testar conexão direta
mysql -u radius -p radius -e "SELECT COUNT(*) FROM radcheck;"

# Verificar log detalhado
journalctl -u freeradius -n 50 | grep -i "sql\|mysql\|error"
```

---

## Veja Também

- [BNG / PPPoE — Roteador Huawei](/pt/roteadores/huawei/bng/)
- [BGP no RouterOS MikroTik](/pt/roteadores/mikrotik/bgp)
- [Zabbix — Instalação como Serviço](/pt/servicos/zabbix)
