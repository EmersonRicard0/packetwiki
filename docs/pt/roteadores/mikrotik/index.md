# MikroTik — Visão Geral

MikroTik é uma empresa letã fundada em 1996, conhecida por oferecer equipamentos de rede com excelente custo-benefício. O sistema operacional proprietário **RouterOS** é o coração de todos os seus roteadores.

## Sistema Operacional: RouterOS

RouterOS é baseado em Linux e pode ser acessado via:

| Interface | Descrição |
|-----------|-----------|
| **CLI (SSH/Telnet)** | Acesso via terminal, ideal para automação |
| **Winbox** | Aplicativo gráfico para Windows/Linux (via Wine) |
| **WebFig** | Interface web, acesso pelo navegador |
| **API** | Integração com scripts e sistemas externos |

## Modelos Cobertos

- [hEX Series](/pt/roteadores/mikrotik/hex-series) — roteadores para uso doméstico/pequenos escritórios
- [CCR (Cloud Core Router)](/pt/roteadores/mikrotik/ccr) — roteadores de alto desempenho para ISPs e data centers
- [RB4011](/pt/roteadores/mikrotik/rb4011) — router/switch combo para ambientes médios

## Acesso Inicial

### Padrões de fábrica

| Parâmetro | Valor padrão |
|-----------|-------------|
| IP | `192.168.88.1` |
| Usuário | `admin` |
| Senha | *(em branco — a partir do RouterOS v6.49+, exige definir senha no primeiro acesso)* |

### Primeiro acesso via Winbox

1. Baixe o Winbox em [mikrotik.com/download](https://mikrotik.com/download)
2. Abra o Winbox e clique na aba **Neighbors**
3. Clique no MAC address do roteador detectado
4. Use `admin` como usuário e deixe a senha em branco
5. Na primeira tela, defina uma senha segura

### Primeiro acesso via SSH

```bash
ssh admin@192.168.88.1
```

## Reset de Fábrica

### Via botão físico (Reset)

1. Desligue o equipamento
2. Segure o botão **RESET**
3. Ligue o equipamento mantendo o botão pressionado
4. Aguarde o LED piscar 3 vezes e solte o botão

### Via CLI

```bash
/system reset-configuration no-defaults=yes skip-backup=yes
```

::: warning Atenção
O reset apaga **todas** as configurações. Faça um backup antes:
```bash
/export file=backup-antes-do-reset
```
:::

## Comandos Essenciais

```bash
# Ver informações do sistema
/system resource print

# Ver interfaces
/interface print

# Ver tabela de roteamento
/ip route print

# Ver log do sistema
/log print

# Ver usuários conectados
/ip hotspot active print

# Fazer backup da configuração
/export file=meu-backup
```

## Atualização de Firmware

```bash
# Verificar versão atual
/system package print

# Verificar atualizações disponíveis
/system package update check-for-updates

# Fazer download e instalar
/system package update download
/system reboot
```

## Artigos Relacionados

- [Configuração de VLANs no MikroTik](/pt/roteadores/mikrotik/vlans)
- [OSPF no RouterOS](/pt/roteadores/mikrotik/ospf)
- [Firewall Filter Rules](/pt/roteadores/mikrotik/firewall)
- [Hotspot — Portal Cativo](/pt/roteadores/mikrotik/hotspot)
