---
description: Guia prático de nftables no Linux — substituto moderno do iptables com sintaxe unificada.
---

# nftables — Firewall Moderno

::: tip Versão testada
**nftables 1.0.x** no Ubuntu 22.04 / Debian 12. Substitui iptables, ip6tables, arptables e ebtables com uma única ferramenta.
:::

O nftables é o substituto oficial do iptables desde o kernel 3.13. Sintaxe mais limpa, melhor performance e suporte nativo a IPv4 e IPv6 na mesma regra.

---

## Conceitos

O nftables usa **tabelas → chains → regras**, similar ao iptables, mas com notação mais legível:

```
tabela (table)
  └── chain
        └── regra (rule)
```

---

## Instalação

```bash
apt install -y nftables
systemctl enable --now nftables
```

---

## Verificar Estado Atual

```bash
# Ver todas as regras ativas
nft list ruleset

# Ver uma tabela específica
nft list table inet filter

# Ver contadores
nft list ruleset -a
```

---

## Configuração Completa — `/etc/nftables.conf`

```bash
nano /etc/nftables.conf
```

```nft
#!/usr/sbin/nft -f
# PacketWiki — nftables básico para servidor ISP

flush ruleset

table inet filter {

    # Bloqueio de IPs banidos (popular via sets)
    set blocklist {
        type ipv4_addr
        flags interval
        elements = { 10.0.0.0/8, 192.168.0.0/16 }  # exemplo
    }

    chain input {
        type filter hook input priority filter; policy drop;

        # Conexões estabelecidas
        ct state established,related accept

        # Loopback
        iif lo accept

        # ICMP (ping limitado)
        ip protocol icmp icmp type echo-request limit rate 10/second accept
        ip6 nexthdr icmpv6 accept

        # SSH — apenas da rede de gerência
        ip saddr 192.168.100.0/24 tcp dport 22 accept

        # SNMP — apenas do servidor Zabbix
        ip saddr 192.168.100.10 udp dport 161 accept

        # Zabbix Agent
        ip saddr 192.168.100.10 tcp dport 10050 accept

        # BGP — apenas com peers conhecidos
        ip saddr 1.2.3.1 tcp dport 179 accept
        ip saddr 1.2.3.1 tcp sport 179 accept

        # Bloquear IPs da blocklist
        ip saddr @blocklist drop

        # Log e drop do resto
        limit rate 5/minute log prefix "nft-drop: "
        drop
    }

    chain forward {
        type filter hook forward priority filter; policy drop;

        ct state established,related accept
    }

    chain output {
        type filter hook output priority filter; policy accept;
    }
}
```

### Aplicar e recarregar

```bash
# Aplicar sem reiniciar o serviço
nft -f /etc/nftables.conf

# Via systemd (persistente)
systemctl reload nftables

# Verificar se foi aplicado
nft list ruleset
```

---

## NAT / MASQUERADE

```bash
table ip nat {
    chain prerouting {
        type nat hook prerouting priority dstnat;
    }

    chain postrouting {
        type nat hook postrouting priority srcnat;

        # Masquerade — sair pela interface eth0
        oif "eth0" masquerade
    }
}
```

### Port Forward

```nft
table ip nat {
    chain prerouting {
        type nat hook prerouting priority dstnat;

        # Redirecionar porta 8080 para servidor interno
        tcp dport 8080 dnat to 192.168.1.10:80
    }

    chain postrouting {
        type nat hook postrouting priority srcnat;
        oif "eth0" masquerade
    }
}
```

---

## Sets — Listas Dinâmicas

```bash
# Adicionar IP a uma blocklist em tempo real
nft add element inet filter blocklist { 203.0.113.10 }

# Remover IP da blocklist
nft delete element inet filter blocklist { 203.0.113.10 }

# Ver conteúdo do set
nft list set inet filter blocklist
```

---

## Serviço systemd

```bash
# Ver status
systemctl status nftables

# Reiniciar após editar /etc/nftables.conf
systemctl reload nftables

# Ver log
journalctl -u nftables -f
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver todas as regras | `nft list ruleset` |
| Aplicar arquivo de config | `nft -f /etc/nftables.conf` |
| Limpar todas as regras | `nft flush ruleset` |
| Adicionar IP ao blocklist | `nft add element inet filter blocklist { IP }` |
| Ver contadores | `nft list ruleset -a` |
| Recarregar serviço | `systemctl reload nftables` |

---

## Veja Também

- [iptables](/pt/linux/firewall/iptables)
- [UFW](/pt/linux/firewall/ufw)
- [WireGuard](/pt/linux/servicos/wireguard)
