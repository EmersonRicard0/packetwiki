---
description: Configuração de VPN WireGuard no Linux — servidor, clientes e casos de uso para ISPs e redes corporativas.
---

# WireGuard — VPN Moderna

::: tip Versão testada
**WireGuard** nativo no kernel Linux 5.6+. Ubuntu 20.04+, Debian 11+ e Rocky Linux 9 suportam nativamente.
:::

WireGuard é um protocolo VPN moderno, extremamente rápido e simples. Muito usado em ISPs para VPN de gestão, túneis entre POPs e acesso remoto seguro de equipe técnica.

---

## Instalação

```bash
# Ubuntu / Debian
apt install -y wireguard wireguard-tools

# Rocky Linux / AlmaLinux
dnf install -y wireguard-tools
```

---

## Configuração do Servidor

### 1. Gerar par de chaves

```bash
# Gerar chave privada
wg genkey | tee /etc/wireguard/private.key | wg pubkey > /etc/wireguard/public.key
chmod 600 /etc/wireguard/private.key

# Ver as chaves
cat /etc/wireguard/private.key
cat /etc/wireguard/public.key
```

### 2. Criar configuração do servidor

```bash
cat > /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address    = 10.10.0.1/24
ListenPort = 51820
PrivateKey = <CHAVE_PRIVADA_DO_SERVIDOR>

# Habilitar IP forwarding (para rotear tráfego dos clients)
PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# --- Peer: Técnico Emerson ---
[Peer]
PublicKey  = <CHAVE_PUBLICA_DO_CLIENTE>
AllowedIPs = 10.10.0.2/32

# --- Peer: POP-02 ---
[Peer]
PublicKey  = <CHAVE_PUBLICA_DO_POP02>
AllowedIPs = 10.10.0.3/32, 192.168.100.0/24
EOF
```

### 3. Habilitar IP forwarding

```bash
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sysctl -p
```

### 4. Iniciar e habilitar

```bash
systemctl enable --now wg-quick@wg0
```

---

## Configuração do Cliente (Linux)

```bash
# Gerar chaves do cliente
wg genkey | tee /etc/wireguard/client-private.key | wg pubkey > /etc/wireguard/client-public.key

cat > /etc/wireguard/wg0.conf << 'EOF'
[Interface]
Address    = 10.10.0.2/24
PrivateKey = <CHAVE_PRIVADA_DO_CLIENTE>
DNS        = 8.8.8.8

[Peer]
PublicKey  = <CHAVE_PUBLICA_DO_SERVIDOR>
Endpoint   = IP_PUBLICO_DO_SERVIDOR:51820
AllowedIPs = 0.0.0.0/0   # rotear todo tráfego pela VPN
             # ou 10.10.0.0/24, 192.168.1.0/24  (split-tunnel)
PersistentKeepalive = 25
EOF

wg-quick up wg0
```

---

## Caso de Uso: Túnel entre POPs

```bash
# POP-01 (servidor, IP público: 200.200.200.1)
[Interface]
Address    = 10.200.0.1/30
ListenPort = 51820
PrivateKey = <CHAVE_PRIVADA_POP01>

[Peer]
# POP-02
PublicKey  = <CHAVE_PUBLICA_POP02>
AllowedIPs = 10.200.0.2/32, 10.0.2.0/24   # rede interna do POP-02
Endpoint   = 200.200.200.2:51820
PersistentKeepalive = 25
```

```bash
# POP-02 (IP público: 200.200.200.2)
[Interface]
Address    = 10.200.0.2/30
ListenPort = 51820
PrivateKey = <CHAVE_PRIVADA_POP02>

[Peer]
# POP-01
PublicKey  = <CHAVE_PUBLICA_POP01>
AllowedIPs = 10.200.0.1/32, 10.0.1.0/24   # rede interna do POP-01
Endpoint   = 200.200.200.1:51820
PersistentKeepalive = 25
```

---

## Comandos de Gerenciamento

```bash
# Ver status e peers conectados
wg show

# Ver configuração ativa
wg showconf wg0

# Adicionar peer em tempo real (sem reiniciar)
wg set wg0 peer <PUBKEY> allowed-ips 10.10.0.5/32

# Remover peer em tempo real
wg set wg0 peer <PUBKEY> remove

# Reiniciar interface
wg-quick down wg0 && wg-quick up wg0

# Ver log de conexões
journalctl -u wg-quick@wg0 -f
```

---

## Firewall — Liberar porta WireGuard

```bash
# UFW
ufw allow 51820/udp

# iptables
iptables -A INPUT -p udp --dport 51820 -j ACCEPT

# firewalld (Rocky/AlmaLinux)
firewall-cmd --permanent --add-port=51820/udp
firewall-cmd --reload
```

---

## Referência Rápida

| Objetivo | Comando |
|----------|---------|
| Ver status | `wg show` |
| Subir interface | `wg-quick up wg0` |
| Derrubar interface | `wg-quick down wg0` |
| Ver peers | `wg show wg0 peers` |
| Ver transferência | `wg show wg0 transfer` |
| Gerar chave privada | `wg genkey` |
| Derivar chave pública | `wg pubkey < private.key` |

---

## Problemas Comuns

### Peer conectado mas sem tráfego

```bash
# Verificar allowed-ips — deve incluir a rede de destino
wg show wg0 allowed-ips

# Verificar se IP forwarding está ativo
sysctl net.ipv4.ip_forward
# deve retornar: net.ipv4.ip_forward = 1

# Verificar regras de NAT
iptables -t nat -L POSTROUTING -v
```

### Interface não sobe

```bash
# Ver erro detalhado
wg-quick up wg0 2>&1

# Verificar sintaxe do arquivo de config
wg-quick strip wg0
```

---

## Veja Também

- [iptables](/pt/linux/firewall/iptables)
- [nftables](/pt/linux/firewall/nftables)
