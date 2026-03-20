---
description: Instalação e configuração do servidor DHCP com Kea e isc-dhcp-server no Linux — pools, reservas estáticas e serviço systemd.
---

# DHCP — Servidor Linux

::: tip Versão testada
**Kea DHCP 2.x** e **isc-dhcp-server 4.4.x** no Ubuntu 22.04 LTS.
:::

Dois servidores DHCP populares no Linux:

| Servidor | Uso recomendado |
|----------|----------------|
| **Kea DHCP** | Instalações novas — moderno, API REST, alta performance |
| **isc-dhcp-server** | Ambientes legados — simples e amplamente documentado |

---

## Opção 1 — Kea DHCP (recomendado)

### Instalar

```bash
apt install -y kea-dhcp4-server
```

### Configurar — `/etc/kea/kea-dhcp4.conf`

```json
{
  "Dhcp4": {
    "interfaces-config": {
      "interfaces": ["eth1"]
    },

    "lease-database": {
      "type": "memfile",
      "persist": true,
      "name": "/var/lib/kea/dhcp4.leases"
    },

    "valid-lifetime": 86400,
    "renew-timer": 43200,
    "rebind-timer": 64800,

    "subnet4": [
      {
        "subnet": "192.168.1.0/24",
        "pools": [
          { "pool": "192.168.1.100 - 192.168.1.200" }
        ],
        "option-data": [
          { "name": "routers",              "data": "192.168.1.1" },
          { "name": "domain-name-servers",  "data": "8.8.8.8, 1.1.1.1" },
          { "name": "broadcast-address",    "data": "192.168.1.255" }
        ],

        "reservations": [
          {
            "hw-address": "aa:bb:cc:dd:ee:ff",
            "ip-address": "192.168.1.50",
            "hostname": "servidor-backup"
          }
        ]
      }
    ],

    "loggers": [
      {
        "name": "kea-dhcp4",
        "output_options": [
          { "output": "/var/log/kea/kea-dhcp4.log" }
        ],
        "severity": "INFO"
      }
    ]
  }
}
```

### Serviço systemd

```bash
# Verificar sintaxe antes de aplicar
kea-dhcp4 -t /etc/kea/kea-dhcp4.conf

# Habilitar e iniciar
systemctl enable --now kea-dhcp4-server
systemctl status kea-dhcp4-server

# Reiniciar após alterar configuração
systemctl restart kea-dhcp4-server

# Ver log em tempo real
journalctl -u kea-dhcp4-server -f
tail -f /var/log/kea/kea-dhcp4.log
```

### Ver leases ativos

```bash
cat /var/lib/kea/dhcp4.leases
```

---

## Opção 2 — isc-dhcp-server (legado)

### Instalar

```bash
apt install -y isc-dhcp-server

# Definir interface de escuta
nano /etc/default/isc-dhcp-server
# INTERFACESv4="eth1"
```

### Configurar — `/etc/dhcp/dhcpd.conf`

```bash
# Configurações globais
default-lease-time 86400;
max-lease-time 86400;
authoritative;

option domain-name-servers 8.8.8.8, 1.1.1.1;

# Subnet principal
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option broadcast-address 192.168.1.255;
}

# Reserva estática por MAC
host servidor-backup {
  hardware ethernet aa:bb:cc:dd:ee:ff;
  fixed-address 192.168.1.50;
}
```

### Serviço systemd

```bash
# Verificar sintaxe
dhcpd -t -cf /etc/dhcp/dhcpd.conf

# Habilitar e iniciar
systemctl enable --now isc-dhcp-server
systemctl status isc-dhcp-server

# Reiniciar após editar config
systemctl restart isc-dhcp-server

# Ver log
journalctl -u isc-dhcp-server -f
```

### Ver leases ativos

```bash
cat /var/lib/dhcp/dhcpd.leases
```

---

## DHCP para Múltiplas VLANs (relay)

Se o servidor DHCP está em uma VLAN diferente dos clientes, configure o DHCP relay no gateway:

```bash
# No servidor Linux que é gateway das VLANs
apt install -y isc-dhcp-relay

# /etc/default/isc-dhcp-relay
SERVERS="192.168.100.10"     # IP do servidor DHCP
INTERFACES="eth1.10 eth1.20" # Interfaces das VLANs de cliente
```

```bash
systemctl enable --now isc-dhcp-relay
```

---

## Referência Rápida

| Objetivo | Kea | isc-dhcp |
|----------|-----|----------|
| Status | `systemctl status kea-dhcp4-server` | `systemctl status isc-dhcp-server` |
| Reiniciar | `systemctl restart kea-dhcp4-server` | `systemctl restart isc-dhcp-server` |
| Ver leases | `cat /var/lib/kea/dhcp4.leases` | `cat /var/lib/dhcp/dhcpd.leases` |
| Log ao vivo | `journalctl -u kea-dhcp4-server -f` | `journalctl -u isc-dhcp-server -f` |
| Testar config | `kea-dhcp4 -t /etc/kea/kea-dhcp4.conf` | `dhcpd -t -cf /etc/dhcp/dhcpd.conf` |

---

## Problemas Comuns

### Serviço não inicia

```bash
# Verificar erro de sintaxe na configuração (Kea)
kea-dhcp4 -t /etc/kea/kea-dhcp4.conf

# Verificar interface configurada
ip link show eth1

# Ver log detalhado
journalctl -u kea-dhcp4-server -n 50 --no-pager
```

### Clientes não recebem IP

```bash
# Verificar se o serviço está na interface correta
ss -ulnp | grep :67

# Capturar pacotes DHCP na interface
tcpdump -i eth1 -n port 67 or port 68

# Verificar firewall
iptables -L INPUT -v -n | grep 67
```

---

## Veja Também

- [WireGuard](/pt/linux/servicos/wireguard)
- [iptables](/pt/linux/firewall/iptables)
