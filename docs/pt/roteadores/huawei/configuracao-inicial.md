---
description: Configuração inicial do roteador Huawei NE — modelo candidato/commit, hostname, usuário, SSH, interface de gerência e loopback.
---

# Configuração Inicial — Roteador Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

Guia para a primeira configuração de roteadores Huawei NE. O principal diferencial em relação a outras plataformas é o **modelo de configuração candidata**: nenhuma alteração entra em vigor até o `commit` explícito. Siga esta sequência antes de qualquer configuração de protocolos.

---

## Sistema de Configuração em Duas Fases (Candidato/Commit)

Os roteadores Huawei NE utilizam um modelo de **configuração candidata**: as alterações ficam pendentes até o `commit`.

```bash
# Entrar no modo de configuração
<PE01> system-view

# Fazer alterações...
[PE01] sysname PE-CIDADE-01

# Revisar o que está pendente antes de confirmar
[PE01] display configuration candidate

# Confirmar as alterações
[PE01] commit

# Descartar alterações não confirmadas
[PE01] rollback
```

::: warning Boas práticas em produção
- Sempre execute `display configuration candidate` antes do `commit`
- Mantenha acesso alternativo (console/OOB) aberto durante commits remotos
- Use `commit timer` para rollback automático em manutenções remotas
:::

---

## Commit com Temporizador (Rollback Automático)

Útil para manutenções remotas: se algo der errado e a sessão cair, o equipamento reverte automaticamente.

```bash
# Se não houver confirmação em 10 minutos, reverte
[PE01] commit timer 10

# Confirmar para cancelar o timer e manter a configuração
[PE01] commit
```

---

## Hostname e Banner

```bash
[PE01] sysname PE-CIDADE-01
[PE01] header login information "Acesso autorizado somente. Atividades monitoradas."
```

---

## Interface de Gerência Out-of-Band

A interface MEth é dedicada ao gerenciamento e fica separada do plano de dados.

```bash
[PE01] interface MEth 0/0/0
[PE01-MEth0/0/0] ip address 10.0.0.1 255.255.255.0
[PE01-MEth0/0/0] description Gerencia-OOB
[PE01-MEth0/0/0] quit

# Rota estática para a rede de gerência
[PE01] ip route-static 0.0.0.0 0.0.0.0 10.0.0.254
[PE01] commit
```

---

## Loopback (Router-ID)

A loopback serve como Router-ID para OSPF e BGP. Deve ser única na rede e sempre estável.

```bash
[PE01] interface LoopBack 0
[PE01-LoopBack0] ip address 10.255.1.1 255.255.255.255
[PE01-LoopBack0] description Router-ID-PE01
[PE01-LoopBack0] quit
[PE01] commit
```

---

## Criar Usuário Local e Habilitar SSH

```bash
[PE01] aaa
[PE01-aaa] local-user admin password irreversible-cipher Admin@2024
[PE01-aaa] local-user admin service-type ssh terminal
[PE01-aaa] local-user admin privilege level 15
[PE01-aaa] quit

# Habilitar servidor SSH
[PE01] stelnet server enable

# Configurar VTYs para aceitar SSH com autenticação AAA
[PE01] user-interface vty 0 4
[PE01-ui-vty0-4] authentication-mode aaa
[PE01-ui-vty0-4] protocol inbound ssh
[PE01-ui-vty0-4] quit

[PE01] commit
```

---

## Salvar Configuração

```bash
<PE01> save
# Confirmar com "y"
```

---

## Verificar Configuração

```bash
# Ver configuração pendente (não confirmada)
[PE01] display configuration candidate

# Ver configuração ativa
<PE01> display current-configuration

# Ver configuração salva (startup)
<PE01> display saved-configuration

# Informações do equipamento
<PE01> display version
<PE01> display device

# Tabela de roteamento
<PE01> display ip routing-table
```

---

## Problemas Comuns

### Alterações não entram em vigor

```bash
# O commit não foi executado — verificar pendências
[PE01] display configuration candidate

# Confirmar
[PE01] commit
```

### SSH não conecta após configuração

```bash
# Verificar se o servidor SSH está ativo
<PE01> display ssh server status

# Verificar usuário e tipo de serviço
<PE01> display local-user

# Verificar VTY
<PE01> display user-interface vty 0 4
```

### Rollback acidental (commit timer expirou)

Se o timer expirar antes de você confirmar, a configuração é revertida automaticamente. Isso é intencional — reconecte e reaplique as mudanças, desta vez confirmando com `commit` antes do timer expirar.

---

## Veja Também

- [OSPF — Roteador Huawei](./ospf)
- [BGP — Roteador Huawei](./bgp)
- [Backup — Roteador Huawei](./backup)
- [Troubleshooting — Roteador Huawei](./troubleshooting)
- [Configuração Inicial — Switch Huawei](/pt/switches/huawei/configuracao-inicial)
