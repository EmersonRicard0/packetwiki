---
description: Guia prático de iptables no Linux — regras essenciais para servidores e equipamentos de rede ISP.
---

# iptables — Firewall Linux

::: tip Versão testada
**iptables 1.8.x** no Ubuntu 22.04 / Debian 12. Para sistemas mais novos, considere [nftables](/pt/linux/firewall/nftables) — o substituto moderno do iptables.
:::

O iptables é o firewall padrão do kernel Linux. Opera em tabelas e chains para filtrar, modificar e rotear pacotes.

---

## Conceitos Básicos

### Tabelas e Chains

| Tabela | Chains | Uso |
|--------|--------|-----|
| `filter` | INPUT, OUTPUT, FORWARD | Filtro de pacotes (padrão) |
| `nat` | PREROUTING, POSTROUTING, OUTPUT | NAT, MASQUERADE, port forward |
| `mangle` | Todas | Modificar cabeçalhos (DSCP, TTL) |

### Ações (targets)

| Target | Efeito |
|--------|--------|
| `ACCEPT` | Permite o pacote |
| `DROP` | Descarta silenciosamente |
| `REJECT` | Descarta e envia ICMP de erro |
| `LOG` | Registra no syslog (não termina) |

---

## Verificar Regras Atuais

```bash
# Ver todas as regras com contadores
iptables -L -v -n

# Ver regras de NAT
iptables -t nat -L -v -n

# Ver regras numeradas (útil para deletar)
iptables -L --line-numbers
```

---

## Regras Essenciais para Servidor

### Política padrão segura

```bash
# Bloquear tudo por padrão (INPUT e FORWARD)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Manter conexões estabelecidas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT
```

### Liberar serviços essenciais

```bash
# SSH (trocar 22 se usar porta diferente)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# HTTP / HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# ICMP (ping) — limitar para não virar vetor de DoS
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 5/s -j ACCEPT

# SNMP — apenas da rede de gerência
iptables -A INPUT -p udp --dport 161 -s 192.168.100.0/24 -j ACCEPT

# Zabbix Agent
iptables -A INPUT -p tcp --dport 10050 -s 192.168.100.10 -j ACCEPT
```

### Regras para BGP (porta 179)

```bash
# Permitir BGP apenas com peers conhecidos
iptables -A INPUT  -p tcp --dport 179 -s 1.2.3.1 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 179 -d 1.2.3.1 -j ACCEPT
iptables -A INPUT  -p tcp --sport 179 -s 1.2.3.1 -j ACCEPT
```

---

## NAT / MASQUERADE (servidor como gateway)

```bash
# Habilitar IP forwarding
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p

# Masquerade para sair pela interface eth0
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Liberar FORWARD entre interfaces
iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT
```

### Port Forward (redirecionar porta)

```bash
# Redirecionar porta 8080 externa para servidor interno 192.168.1.10:80
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80
iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT
```

---

## Logging de Pacotes Bloqueados

```bash
# Registrar antes de bloquear (limite para não lotar o disco)
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "IPT-DROP: " --log-level 4

# Ver logs
journalctl -k | grep "IPT-DROP"
# ou
tail -f /var/log/syslog | grep "IPT-DROP"
```

---

## Salvar e Restaurar Regras

### Salvar regras atuais

```bash
# Instalar iptables-persistent
apt install -y iptables-persistent

# Salvar regras IPv4 e IPv6
iptables-save  > /etc/iptables/rules.v4
ip6tables-save > /etc/iptables/rules.v6
```

### Restaurar manualmente

```bash
iptables-restore < /etc/iptables/rules.v4
```

### Persistência automática no boot

```bash
# O iptables-persistent já cria um serviço systemd
systemctl enable netfilter-persistent
systemctl status netfilter-persistent
```

---

## Script de Firewall Completo (exemplo ISP)

```bash
#!/bin/bash
# /etc/firewall.sh — Firewall básico para servidor de gerência ISP

IPT="iptables"

# Limpar regras
$IPT -F
$IPT -X
$IPT -t nat -F

# Políticas padrão
$IPT -P INPUT DROP
$IPT -P FORWARD DROP
$IPT -P OUTPUT ACCEPT

# Conexões estabelecidas
$IPT -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
$IPT -A INPUT -i lo -j ACCEPT

# SSH — apenas da rede de gerência
$IPT -A INPUT -p tcp --dport 22 -s 192.168.100.0/24 -j ACCEPT

# ICMP limitado
$IPT -A INPUT -p icmp --icmp-type echo-request -m limit --limit 10/s -j ACCEPT

# SNMP — apenas do Zabbix
$IPT -A INPUT -p udp --dport 161 -s 192.168.100.10 -j ACCEPT

# Zabbix Agent
$IPT -A INPUT -p tcp --dport 10050 -s 192.168.100.10 -j ACCEPT

# BGP com peers conhecidos
$IPT -A INPUT -p tcp --dport 179 -s 1.2.3.1 -j ACCEPT
$IPT -A INPUT -p tcp --sport 179 -s 1.2.3.1 -j ACCEPT

# Log e drop do resto
$IPT -A INPUT -m limit --limit 5/min -j LOG --log-prefix "IPT-DROP: "
$IPT -A INPUT -j DROP

echo "Firewall aplicado."
```

```bash
chmod +x /etc/firewall.sh
/etc/firewall.sh
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver regras | `iptables -L -v -n` |
| Ver regras NAT | `iptables -t nat -L -v -n` |
| Limpar todas as regras | `iptables -F` |
| Salvar regras | `iptables-save > /etc/iptables/rules.v4` |
| Restaurar regras | `iptables-restore < /etc/iptables/rules.v4` |
| Ver logs de bloqueio | `journalctl -k \| grep IPT-DROP` |

---

## Veja Também

- [nftables](/pt/linux/firewall/nftables)
- [UFW](/pt/linux/firewall/ufw)
- [WireGuard](/pt/linux/servicos/wireguard)
