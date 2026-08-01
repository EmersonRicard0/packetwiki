---
description: "Guia completo para implantar um servidor Speedtest Ookla no Debian 13 com rede estática, systemd, DNS, HTTPS e validação operacional."
---

# Speedtest Ookla no Debian 13

Este guia cobre a implantação de um servidor **Speedtest Ookla** em **Debian 13**, incluindo preparação do sistema, rede no servidor, SSH, instalação do OoklaServer, serviço systemd, DNS, HTTPS com Let's Encrypt, renovação automática, cadastro no portal da Ookla, validação e troubleshooting.

::: warning Ambiente de exemplo
Os endereços abaixo são reservados para documentação. Substitua pelos dados reais do ambiente antes de executar em produção.
:::

## 1. Topologia de exemplo

```text
Internet
   |
Roteador/Core/Gateway
203.0.113.49/30
   |
Servidor Debian 13
203.0.113.50/30
```

Endereçamento usado no guia:

| Item | Valor |
|------|-------|
| Rede | `203.0.113.48/30` |
| Gateway | `203.0.113.49` |
| Servidor | `203.0.113.50` |
| Broadcast | `203.0.113.51` |
| Domínio | `speedtest.exemplo.com.br` |
| Interface | `enp3s0f0` |
| Usuário do serviço | `speedtest` |

## 2. Requisitos recomendados

Baseline prática para implantação:

| Recurso | Recomendação |
|---------|--------------|
| CPU | 4 núcleos físicos ou mais |
| Memória RAM | 8 GB ou mais |
| Armazenamento | 20 GB ou mais |
| Rede | 1 Gbps ou mais |
| Sistema | Debian 13 64 bits |
| Arquitetura | `x86_64` |

Para testes acima de 1 Gbps, dê preferência a:

- processadores com IPC mais alto;
- interface 10GbE;
- barramento PCIe adequado;
- somente um socket de CPU;
- NUMA desabilitado, quando possível;
- memória de 16 GB ou mais;
- link dedicado ou com capacidade reservada.

Verifique o hardware:

```bash
lscpu
free -h
lsblk
ip -br link
lscpu | grep -E 'Model name|Socket|Core|Thread'
uname -m
```

A arquitetura esperada é:

```text
x86_64
```

## 3. Configuração temporária da rede

Identifique a interface:

```bash
ip -br link
ip -br address
```

Exemplo:

```text
enp3s0f0
```

Se estiver conectado localmente ao servidor, faça um teste temporário:

```bash
ip addr flush dev enp3s0f0
ip addr add 203.0.113.50/30 dev enp3s0f0
ip link set enp3s0f0 up
ip route replace default via 203.0.113.49 dev enp3s0f0
ip neigh flush dev enp3s0f0
```

Valide:

```bash
ip -br address show enp3s0f0
ip route
ping -c 4 203.0.113.49
ping -c 4 1.1.1.1
ping -c 4 deb.debian.org
```

Resultado esperado:

```text
enp3s0f0    UP    203.0.113.50/30
```

Roteamento esperado:

```text
default via 203.0.113.49 dev enp3s0f0
203.0.113.48/30 dev enp3s0f0 proto kernel scope link src 203.0.113.50
```

## 4. Tornar a rede permanente

A configuração feita com `ip addr` desaparece após reiniciar.

Veja qual gerenciador está ativo:

```bash
systemctl is-active networking
systemctl is-active systemd-networkd
systemctl is-active NetworkManager
```

### Usando `/etc/network/interfaces`

Esse é um modelo comum em instalações mínimas do Debian.

```bash
cp -a /etc/network/interfaces \
  /etc/network/interfaces.bak-$(date +%F-%H%M%S)

nano /etc/network/interfaces
```

Exemplo:

```text
auto lo
iface lo inet loopback

auto enp3s0f0
iface enp3s0f0 inet static
    address 203.0.113.50/30
    gateway 203.0.113.49
    dns-nameservers 1.1.1.1 8.8.8.8
```

Aplique:

```bash
systemctl restart networking
```

::: warning Atenção
Reiniciar a rede por SSH pode derrubar sua conexão. Faça essa etapa pelo console local, iDRAC, iLO ou acesso fora de banda.
:::

Valide:

```bash
ip -br address
ip route
cat /etc/resolv.conf
```

### Usando `systemd-networkd`

Crie:

```bash
nano /etc/systemd/network/20-speedtest.network
```

Conteúdo:

```ini
[Match]
Name=enp3s0f0

[Network]
Address=203.0.113.50/30
Gateway=203.0.113.49
DNS=1.1.1.1
DNS=8.8.8.8
```

Ative:

```bash
systemctl enable --now systemd-networkd
systemctl restart systemd-networkd
```

Valide:

```bash
networkctl status enp3s0f0
ip route
```

::: danger Evite conflito
Não configure simultaneamente a mesma interface em `/etc/network/interfaces` e no `systemd-networkd`.
:::

## 5. Hostname e horário

Configure o hostname:

```bash
hostnamectl set-hostname speedtest-server
hostnamectl
```

Configure o fuso horário:

```bash
timedatectl set-timezone America/Fortaleza
timedatectl set-ntp true
timedatectl
```

O horário correto é importante para certificados TLS, logs, renovação Let's Encrypt, comunicação com serviços externos e troubleshooting.

## 6. Repositórios do Debian 13

Caso o `apt update` não encontre pacotes ou apresente `Package openssh-server has no installation candidate`, configure os repositórios do Debian 13, codinome `trixie`.

```bash
cp -a /etc/apt/sources.list \
  /etc/apt/sources.list.bak-$(date +%F-%H%M%S) 2>/dev/null || true

cat > /etc/apt/sources.list <<'EOF'
deb http://deb.debian.org/debian trixie main contrib non-free non-free-firmware
deb http://deb.debian.org/debian trixie-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
EOF

apt clean
rm -rf /var/lib/apt/lists/*
apt update
apt upgrade -y
```

## 7. Ferramentas necessárias

```bash
apt install -y \
  ca-certificates \
  wget \
  curl \
  openssl \
  openssh-server \
  sudo \
  dnsutils \
  netcat-openbsd \
  ethtool \
  certbot
```

## 8. Usuário do Speedtest

Recomendação:

- `speedtest`: usuário do serviço;
- outro usuário administrativo com `sudo`;
- `root` sem login remoto.

Caso queira usar somente o usuário `speedtest`:

```bash
adduser speedtest
usermod -aG sudo speedtest
id speedtest
```

Se quiser manter o usuário exclusivamente para o serviço, não o adicione ao grupo `sudo`.

## 9. SSH

Instale e ative:

```bash
systemctl enable --now ssh
systemctl status ssh --no-pager -l
ss -lntp | grep ':22'
```

Teste de outro computador:

```bash
ssh speedtest@203.0.113.50
```

No PowerShell:

```powershell
Test-NetConnection 203.0.113.50 -Port 22
```

Como o servidor possui IP público, restrinja o acesso.

```bash
nano /etc/ssh/sshd_config.d/99-speedtest-hardening.conf
```

Exemplo inicial:

```text
PermitRootLogin no
MaxAuthTries 3
LoginGraceTime 30
AllowUsers speedtest
```

Após configurar chaves SSH, também é possível desabilitar senha:

```text
PasswordAuthentication no
PubkeyAuthentication yes
```

Valide antes de reiniciar:

```bash
sshd -t
systemctl restart ssh
```

Não feche a sessão atual antes de testar uma nova conexão.

## 10. Instalar o OoklaServer

Entre como o usuário `speedtest`:

```bash
su - speedtest
whoami
cd /home/speedtest
```

Baixe e execute o instalador:

```bash
wget https://install.speedtest.net/ooklaserver/ooklaserver.sh
chmod +x ooklaserver.sh
./ooklaserver.sh install
```

Quando o instalador pedir confirmação, digite:

```text
y
```

Ao finalizar, confira os processos:

```bash
pgrep -a OoklaServer
```

Confira as portas:

```bash
ss -lntup | grep -E ':(5060|8080)\b'
```

O OoklaServer deve escutar em:

| Protocolo | Porta |
|-----------|-------|
| TCP | `5060` |
| UDP | `5060` |
| TCP | `8080` |
| UDP | `8080` |

Teste localmente:

```bash
wget -qO- http://127.0.0.1:8080
```

Resposta esperada:

```html
<html>
<head>
<title>OoklaServer</title>
</head>
<body>
<h1>OoklaServer</h1>
<p>It worked!</p>
</body>
</html>
```

## 11. Serviço systemd

O instalador inicia o daemon, mas não necessariamente cria um serviço no systemd.

Volte para `root`:

```bash
su -
```

Antes de criar o serviço, pare qualquer execução manual:

```bash
pkill -TERM -x OoklaServer 2>/dev/null || true
sleep 3
pkill -KILL -x OoklaServer 2>/dev/null || true
rm -f /home/speedtest/OoklaServer.pid
pgrep -a OoklaServer || echo "Nenhum processo OoklaServer ativo"
```

Crie o serviço:

```bash
cat > /etc/systemd/system/ooklaserver.service <<'EOF'
[Unit]
Description=Ookla Speedtest Server
Wants=network-online.target
After=network-online.target

[Service]
Type=forking
User=speedtest
Group=speedtest
WorkingDirectory=/home/speedtest

ExecStart=/home/speedtest/ooklaserver.sh start

KillMode=control-group
KillSignal=SIGTERM
SendSIGKILL=yes

Restart=on-failure
RestartSec=5

TimeoutStartSec=60
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
EOF
```

Recarregue o systemd, ative no boot e inicie:

```bash
systemctl daemon-reload
systemctl enable --now ooklaserver
systemctl status ooklaserver --no-pager -l
systemctl is-enabled ooklaserver
systemctl is-active ooklaserver
```

Resultado esperado:

```text
enabled
active
```

Valide processos, portas e HTTP local:

```bash
pgrep -a OoklaServer
ss -lntup | grep -E ':(5060|8080)\b'
wget -qO- http://127.0.0.1:8080
```

### Administração do serviço

| Ação | Comando |
|------|---------|
| Iniciar | `systemctl start ooklaserver` |
| Parar | `systemctl stop ooklaserver` |
| Reiniciar | `systemctl restart ooklaserver` |
| Status | `systemctl status ooklaserver` |
| Logs recentes | `journalctl -u ooklaserver -n 100 --no-pager` |
| Logs em tempo real | `journalctl -u ooklaserver -f` |

Não use mais:

```bash
./ooklaserver.sh start
```

Controle o daemon somente pelo systemd, evitando processos duplicados.

## 12. DNS

No provedor DNS, crie um registro:

| Campo | Valor |
|-------|-------|
| Tipo | `A` |
| Nome | `speedtest` |
| Destino | `203.0.113.50` |
| TTL | `300` |
| Proxy | desativado |

O FQDN será:

```text
speedtest.exemplo.com.br
```

Não coloque no valor do registro:

```text
http://203.0.113.50
203.0.113.50:8080
```

Use apenas:

```text
203.0.113.50
```

Valide:

```bash
getent ahostsv4 speedtest.exemplo.com.br
dig +short A speedtest.exemplo.com.br
dig +short A speedtest.exemplo.com.br @1.1.1.1
dig +short A speedtest.exemplo.com.br @8.8.8.8
```

A resposta precisa ser:

```text
203.0.113.50
```

## 13. Acesso externo

Teste pelo IP:

```text
http://203.0.113.50:8080
```

Teste pelo domínio:

```text
http://speedtest.exemplo.com.br:8080
```

No servidor:

```bash
wget -S -O- http://speedtest.exemplo.com.br:8080
```

De outro Linux:

```bash
nc -vz speedtest.exemplo.com.br 8080
nc -vz speedtest.exemplo.com.br 5060
```

No PowerShell:

```powershell
Test-NetConnection speedtest.exemplo.com.br -Port 8080
Test-NetConnection speedtest.exemplo.com.br -Port 5060
```

::: info UDP
O teste das portas UDP deve ser feito pelo Server Tester da Ookla ou por uma ferramenta capaz de validar efetivamente a resposta UDP. O `nc -u` sozinho não garante que a aplicação respondeu.
:::

## 14. Portas necessárias

Garanta passagem de entrada e saída para:

| Protocolo | Porta | Uso |
|-----------|-------|-----|
| TCP | `5060` | OoklaServer |
| UDP | `5060` | OoklaServer |
| TCP | `8080` | OoklaServer HTTP/HTTPS |
| UDP | `8080` | OoklaServer |
| TCP | `80` | emissão e renovação do certificado |
| TCP | `443` | downloads e comunicação HTTPS |

O SSH pode permanecer na porta `22`, mas deve ser restrito aos IPs de gerenciamento.

Para o Certbot standalone, a porta `80/TCP` precisa chegar ao IP público do servidor.

## 15. Certificado HTTPS

O domínio deve estar resolvendo corretamente antes dessa etapa.

```bash
apt update
apt install -y certbot openssl

certbot certonly \
  --standalone \
  -d speedtest.exemplo.com.br
```

Ao finalizar:

```text
Successfully received certificate.
```

Arquivos gerados:

```text
/etc/letsencrypt/live/speedtest.exemplo.com.br/fullchain.pem
/etc/letsencrypt/live/speedtest.exemplo.com.br/privkey.pem
```

O Certbot também ativa um timer de renovação:

```bash
systemctl status certbot.timer
```

## 16. Copiar certificado para o usuário Speedtest

O processo executa como usuário `speedtest`, portanto não deve acessar diretamente a chave privada dentro do diretório restrito do Let's Encrypt.

```bash
DOMAIN="speedtest.exemplo.com.br"
SRC="/etc/letsencrypt/live/${DOMAIN}"
DST="/home/speedtest/tls"

install -d \
  -o speedtest \
  -g speedtest \
  -m 750 \
  "$DST"

install \
  -o speedtest \
  -g speedtest \
  -m 640 \
  "$SRC/fullchain.pem" \
  "$DST/fullchain.pem"

install \
  -o speedtest \
  -g speedtest \
  -m 600 \
  "$SRC/privkey.pem" \
  "$DST/privkey.pem"

ls -lah /home/speedtest/tls
```

Resultado esperado:

```text
-rw-r----- speedtest speedtest fullchain.pem
-rw------- speedtest speedtest privkey.pem
```

## 17. HTTPS no OoklaServer

Confira os arquivos:

```bash
ls -lah /home/speedtest/OoklaServer.properties*
```

Caso o arquivo ativo não exista:

```bash
cp /home/speedtest/OoklaServer.properties.default \
   /home/speedtest/OoklaServer.properties
```

Faça backup:

```bash
cp -a \
  /home/speedtest/OoklaServer.properties \
  "/home/speedtest/OoklaServer.properties.bak-$(date +%F-%H%M%S)"
```

Remova configurações TLS antigas ou duplicadas:

```bash
sed -i \
  -e '/^[[:space:]#]*OoklaServer\.ssl\.useLetsEncrypt[[:space:]]*=/d' \
  -e '/^[[:space:]#]*openSSL\.server\.certificateFile[[:space:]]*=/d' \
  -e '/^[[:space:]#]*openSSL\.server\.privateKeyFile[[:space:]]*=/d' \
  /home/speedtest/OoklaServer.properties
```

Adicione:

```bash
cat >> /home/speedtest/OoklaServer.properties <<'EOF'

# HTTPS com certificado Let's Encrypt
OoklaServer.ssl.useLetsEncrypt = false
openSSL.server.certificateFile = /home/speedtest/tls/fullchain.pem
openSSL.server.privateKeyFile = /home/speedtest/tls/privkey.pem
EOF
```

Ajuste permissões:

```bash
chown speedtest:speedtest \
  /home/speedtest/OoklaServer.properties

chmod 640 \
  /home/speedtest/OoklaServer.properties
```

Confira e reinicie:

```bash
grep -nE \
  'useLetsEncrypt|certificateFile|privateKeyFile' \
  /home/speedtest/OoklaServer.properties

systemctl restart ooklaserver
sleep 5
systemctl status ooklaserver --no-pager -l
```

## 18. Testar HTTPS

```bash
wget -S -O- \
  https://speedtest.exemplo.com.br:8080
```

Resposta esperada:

```text
HTTP/1.1 200 OK
```

E:

```html
<h1>OoklaServer</h1>
<p>It worked!</p>
```

Valide o certificado apresentado:

```bash
openssl s_client \
  -connect speedtest.exemplo.com.br:8080 \
  -servername speedtest.exemplo.com.br \
  </dev/null 2>/dev/null |
openssl x509 \
  -noout \
  -subject \
  -issuer \
  -dates
```

Teste no navegador:

```text
https://speedtest.exemplo.com.br:8080
```

O OoklaServer pode responder tanto HTTP quanto HTTPS na porta `8080`.

## 19. Renovação automática do certificado

O Certbot renova os arquivos dentro de `/etc/letsencrypt`, mas precisamos copiar as versões novas para `/home/speedtest/tls`.

Crie o diretório de hooks:

```bash
mkdir -p /etc/letsencrypt/renewal-hooks/deploy
```

Crie o script:

```bash
cat > /etc/letsencrypt/renewal-hooks/deploy/ooklaserver.sh <<'EOF'
#!/bin/sh
set -eu

DOMAIN="speedtest.exemplo.com.br"
SRC="/etc/letsencrypt/live/${DOMAIN}"
DST="/home/speedtest/tls"

install -d \
  -o speedtest \
  -g speedtest \
  -m 750 \
  "$DST"

install \
  -o speedtest \
  -g speedtest \
  -m 640 \
  "$SRC/fullchain.pem" \
  "$DST/fullchain.pem"

install \
  -o speedtest \
  -g speedtest \
  -m 600 \
  "$SRC/privkey.pem" \
  "$DST/privkey.pem"

systemctl restart ooklaserver
EOF
```

Dê permissão e teste:

```bash
chmod 750 \
  /etc/letsencrypt/renewal-hooks/deploy/ooklaserver.sh

/etc/letsencrypt/renewal-hooks/deploy/ooklaserver.sh
systemctl is-active ooklaserver
certbot renew --dry-run
systemctl list-timers | grep certbot
```

## 20. Cadastro no portal da Ookla

No campo do servidor, informe apenas o hostname:

```text
speedtest.exemplo.com.br
```

Não informe:

```text
http://speedtest.exemplo.com.br
https://speedtest.exemplo.com.br
speedtest.exemplo.com.br:8080
```

O portal normalmente acrescenta a porta `8080`.

Preencha:

| Campo | Valor |
|-------|-------|
| OoklaServer | `speedtest.exemplo.com.br` |
| Processor | modelo real da CPU |
| Memory Amount | memória real instalada |
| Available Bandwidth | banda realmente disponível |
| Organization Name | nome da organização |
| Organization Website | endereço institucional |
| Server City | cidade física do servidor |
| Server State/Region | estado |
| Server Country | país |

A banda informada deve representar a capacidade real disponível para o servidor. Não informe 10 Gbps apenas porque a placa de rede é 10GbE.

Depois do envio, o status pode aparecer como:

```text
Pending Review
```

Durante a análise, mantenha servidor ligado, DNS ativo, IP público disponível, portas abertas, OoklaServer rodando e HTTP/HTTPS respondendo.

## 21. Checklist de validação

Sistema:

```bash
hostnamectl
timedatectl
uname -m
cat /etc/os-release
```

Hardware:

```bash
lscpu
free -h
lsblk
ethtool enp3s0f0
```

Rede:

```bash
ip -br address
ip route
ip neigh
ping -c 4 203.0.113.49
ping -c 4 1.1.1.1
getent ahostsv4 speedtest.exemplo.com.br
dig +short speedtest.exemplo.com.br
```

Serviço:

```bash
systemctl is-enabled ooklaserver
systemctl is-active ooklaserver
systemctl status ooklaserver --no-pager -l
pgrep -a OoklaServer
ss -lntup | grep -E ':(5060|8080)\b'
```

HTTP e HTTPS:

```bash
wget -qO- http://127.0.0.1:8080
wget -qO- http://speedtest.exemplo.com.br:8080
wget -qO- https://speedtest.exemplo.com.br:8080

openssl s_client \
  -connect speedtest.exemplo.com.br:8080 \
  -servername speedtest.exemplo.com.br \
  </dev/null 2>/dev/null |
openssl x509 -noout -subject -issuer -dates
```

## 22. Teste após reinicialização

Antes de reiniciar:

```bash
systemctl is-enabled ooklaserver
cat /etc/network/interfaces
# ou
cat /etc/systemd/network/*.network
```

Reinicie:

```bash
reboot
```

Após o retorno:

```bash
ip -br address
ip route
systemctl status ooklaserver --no-pager -l
ss -lntup | grep -E ':(5060|8080)\b'
wget -qO- https://speedtest.exemplo.com.br:8080
```

## 23. Troubleshooting

### `sudo: command not found`

Você provavelmente está como `root` ou o pacote não está instalado.

```bash
whoami
apt install -y sudo
```

### `Package openssh-server has no installation candidate`

Os repositórios APT estão ausentes ou incorretos.

```bash
cat /etc/apt/sources.list
apt update
apt-cache policy openssh-server
```

Use os repositórios do Debian 13 `trixie`.

### `Destination Host Unreachable`

Confira:

```bash
ip route
ip route get 203.0.113.49
ip neigh show dev enp3s0f0
```

Se aparecer `FAILED`, o problema é ARP ou camada 2.

Possíveis causas:

- IP duplicado;
- gateway incorreto;
- máscara incorreta;
- interface conectada ao domínio L2 incorreto;
- cabo ou SFP;
- IP do servidor igual ao IP do gateway.

### Domínio não resolve

```bash
dig +short A speedtest.exemplo.com.br
```

Se não retornar o IP, verifique registro A, servidor DNS autoritativo, propagação, erro de digitação e proxy DNS/CDN habilitado.

### Porta 8080 local funciona, mas externamente não

```bash
ss -lntup | grep ':8080'
```

Se estiver escutando, verifique ACL, firewall upstream, rota de retorno, anúncio do bloco, NAT, filtro no provedor e firewall local.

### Serviço systemd não inicia

```bash
systemctl status ooklaserver --no-pager -l
journalctl -u ooklaserver -n 100 --no-pager
pgrep -a OoklaServer

systemctl stop ooklaserver 2>/dev/null || true
pkill -TERM -x OoklaServer 2>/dev/null || true
sleep 3
pkill -KILL -x OoklaServer 2>/dev/null || true
rm -f /home/speedtest/OoklaServer.pid
systemctl reset-failed ooklaserver
systemctl start ooklaserver
```

### Muitos processos OoklaServer

É normal haver processos auxiliares `ward`. O problema ocorre quando existem dois daemons iniciados separadamente.

Não use simultaneamente:

```bash
./ooklaserver.sh start
```

e:

```bash
systemctl start ooklaserver
```

Use somente o systemd.

### HTTPS não funciona

```bash
ls -lah /home/speedtest/tls

openssl pkey \
  -in /home/speedtest/tls/privkey.pem \
  -check \
  -noout

openssl x509 \
  -in /home/speedtest/tls/fullchain.pem \
  -noout \
  -subject \
  -issuer \
  -dates

grep -nE \
  'useLetsEncrypt|certificateFile|privateKeyFile' \
  /home/speedtest/OoklaServer.properties

systemctl restart ooklaserver
journalctl -u ooklaserver -n 100 --no-pager
```

## 24. Backup recomendado

```bash
mkdir -p /root/backup-speedtest

cp -a \
  /home/speedtest/OoklaServer.properties \
  /root/backup-speedtest/

cp -a \
  /etc/systemd/system/ooklaserver.service \
  /root/backup-speedtest/

cp -a \
  /etc/network/interfaces \
  /root/backup-speedtest/ 2>/dev/null || true

cp -a \
  /etc/letsencrypt/renewal-hooks/deploy/ooklaserver.sh \
  /root/backup-speedtest/
```

Não copie a chave privada para locais inseguros.

## 25. Monitoramento recomendado

Monitore no Zabbix ou ferramenta equivalente:

- disponibilidade ICMP;
- disponibilidade TCP 8080;
- disponibilidade TCP 5060;
- status do serviço systemd;
- uso de CPU;
- load average;
- uso de memória;
- uso de disco;
- tráfego da interface;
- erros e descartes da interface;
- temperatura do servidor;
- expiração do certificado TLS;
- tempo de resposta HTTP.

Comandos úteis:

```bash
systemctl is-active ooklaserver
ss -lntup | grep -E ':(5060|8080)\b'
curl -fsS \
  https://speedtest.exemplo.com.br:8080 \
  >/dev/null

openssl s_client \
  -connect speedtest.exemplo.com.br:8080 \
  -servername speedtest.exemplo.com.br \
  </dev/null 2>/dev/null |
openssl x509 -noout -enddate
```

## 26. Script rápido de diagnóstico

```bash
cat > /root/check-speedtest.sh <<'EOF'
#!/bin/bash

echo "=== DATA E HORÁRIO ==="
date
echo

echo "=== SISTEMA ==="
hostnamectl
echo

echo "=== INTERFACES ==="
ip -br address
echo

echo "=== ROTAS ==="
ip route
echo

echo "=== SERVIÇO ==="
systemctl is-enabled ooklaserver 2>/dev/null
systemctl is-active ooklaserver 2>/dev/null
echo

echo "=== PROCESSOS ==="
pgrep -a OoklaServer
echo

echo "=== PORTAS ==="
ss -lntup | grep -E ':(5060|8080)\b'
echo

echo "=== TESTE HTTP LOCAL ==="
wget -qO- http://127.0.0.1:8080
echo
EOF

chmod +x /root/check-speedtest.sh
/root/check-speedtest.sh
```

## 27. Resumo final da arquitetura

| Item | Valor |
|------|-------|
| Gateway | `203.0.113.49` |
| Servidor Debian | `203.0.113.50/30` |
| DNS | `speedtest.exemplo.com.br -> 203.0.113.50` |
| OoklaServer | `TCP/UDP 5060`, `TCP/UDP 8080` |
| HTTP | `http://speedtest.exemplo.com.br:8080` |
| HTTPS | `https://speedtest.exemplo.com.br:8080` |
| Serviço | `ooklaserver.service` |
| Usuário | `speedtest` |
| Certificado | `/home/speedtest/tls/fullchain.pem` |
| Chave privada | `/home/speedtest/tls/privkey.pem` |
| Renovação | `/etc/letsencrypt/renewal-hooks/deploy/ooklaserver.sh` |

## Veja também

- [Zabbix](/pt/servicos/zabbix)
- [Grafana + Prometheus](/pt/servicos/grafana)
- [Servidores Linux](/pt/linux/)
