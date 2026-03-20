---
description: Instalação do Zabbix via Docker Compose — forma mais rápida e fácil de rodar o Zabbix em produção.
---

# Zabbix — Instalação via Docker

::: tip Versão testada
**Zabbix 6.4 LTS** com Docker Compose v2 no Ubuntu 22.04 LTS.
:::

Docker Compose é a forma mais rápida de colocar o Zabbix no ar — sem configurar banco de dados manualmente, sem instalar PHP separado. Tudo em containers.

---

## 1. Instalar Docker e Docker Compose

```bash
# Remover versões antigas
apt remove -y docker docker-engine docker.io containerd runc

# Instalar via script oficial
curl -fsSL https://get.docker.com | bash

# Verificar instalação
docker --version
docker compose version
```

---

## 2. Criar Estrutura de Diretórios

```bash
mkdir -p /opt/zabbix
cd /opt/zabbix
```

---

## 3. Criar o `docker-compose.yml`

```bash
nano /opt/zabbix/docker-compose.yml
```

```yaml
version: '3.8'

services:

  # ── Banco de dados MySQL ──────────────────────────
  zabbix-db:
    image: mysql:8.0
    container_name: zabbix-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE:      zabbix
      MYSQL_USER:          zabbix
      MYSQL_PASSWORD:      SenhaZabbix@2024
      MYSQL_ROOT_PASSWORD: RootZabbix@2024
    volumes:
      - zabbix-db-data:/var/lib/mysql
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
    networks:
      - zabbix-net

  # ── Zabbix Server ─────────────────────────────────
  zabbix-server:
    image: zabbix/zabbix-server-mysql:ubuntu-6.4-latest
    container_name: zabbix-server
    restart: unless-stopped
    depends_on:
      - zabbix-db
    environment:
      DB_SERVER_HOST:      zabbix-db
      MYSQL_DATABASE:      zabbix
      MYSQL_USER:          zabbix
      MYSQL_PASSWORD:      SenhaZabbix@2024
      MYSQL_ROOT_PASSWORD: RootZabbix@2024
      ZBX_CACHESIZE:       128M
      ZBX_STARTPOLLERS:    10
    ports:
      - "10051:10051"
    volumes:
      - zabbix-server-data:/var/lib/zabbix
    networks:
      - zabbix-net

  # ── Zabbix Frontend (Web) ─────────────────────────
  zabbix-web:
    image: zabbix/zabbix-web-nginx-mysql:ubuntu-6.4-latest
    container_name: zabbix-web
    restart: unless-stopped
    depends_on:
      - zabbix-server
      - zabbix-db
    environment:
      ZBX_SERVER_HOST:     zabbix-server
      DB_SERVER_HOST:      zabbix-db
      MYSQL_DATABASE:      zabbix
      MYSQL_USER:          zabbix
      MYSQL_PASSWORD:      SenhaZabbix@2024
      PHP_TZ:              America/Sao_Paulo
    ports:
      - "80:8080"
    networks:
      - zabbix-net

  # ── Zabbix Agent (monitora o próprio servidor) ────
  zabbix-agent:
    image: zabbix/zabbix-agent2:ubuntu-6.4-latest
    container_name: zabbix-agent
    restart: unless-stopped
    depends_on:
      - zabbix-server
    environment:
      ZBX_SERVER_HOST: zabbix-server
      ZBX_HOSTNAME:    zabbix-server
    networks:
      - zabbix-net

volumes:
  zabbix-db-data:
  zabbix-server-data:

networks:
  zabbix-net:
    driver: bridge
```

---

## 4. Iniciar os Containers

```bash
cd /opt/zabbix

# Baixar imagens e iniciar em background
docker compose up -d

# Acompanhar os logs durante a inicialização (aguarde ~2 min)
docker compose logs -f
```

Acessar: `http://IP_DO_SERVIDOR`

```
Usuário: Admin
Senha:   zabbix
```

::: warning
Troque a senha padrão imediatamente.
:::

---

## 5. Gerenciar os Containers

```bash
# Ver status de todos os containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver log de um serviço específico
docker compose logs -f zabbix-server
docker compose logs -f zabbix-web

# Reiniciar todos
docker compose restart

# Reiniciar apenas o servidor
docker compose restart zabbix-server

# Parar tudo
docker compose down

# Parar e remover volumes (⚠ apaga dados)
docker compose down -v
```

---

## 6. Atualizar o Zabbix

```bash
cd /opt/zabbix

# Baixar versões novas das imagens
docker compose pull

# Recriar containers com a nova versão
docker compose up -d
```

---

## 7. Instalar Agente nos Servidores Monitorados

No servidor que você quer monitorar (fora do Docker):

```bash
# Ubuntu/Debian
apt install -y zabbix-agent2

nano /etc/zabbix/zabbix_agent2.conf
# Server=IP_DO_SERVIDOR_ZABBIX
# Hostname=nome-do-servidor

systemctl enable --now zabbix-agent2
```

---

## Referência Rápida

| Ação | Comando |
|------|---------|
| Iniciar | `docker compose up -d` |
| Status | `docker compose ps` |
| Logs | `docker compose logs -f` |
| Reiniciar | `docker compose restart` |
| Parar | `docker compose down` |
| Atualizar | `docker compose pull && docker compose up -d` |

---

## Veja Também

- [Zabbix — Instalação nativa](/pt/servicos/zabbix)
- [Grafana + Prometheus via Docker](/pt/servicos/grafana-docker)
