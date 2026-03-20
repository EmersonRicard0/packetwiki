# AAA — BNG Huawei

::: tip Versão testada
VRP **V800R021C10** (NE40E / NE8000). Compatível com V800R011+.
:::

## Conceito

- **Authentication scheme** — define o método de autenticação (RADIUS, local)
- **Accounting scheme** — define como a contabilidade é feita
- **Authorization** — aplica políticas após autenticação bem-sucedida

## Criar Esquema de Autenticação

```bash
[BNG] aaa
[BNG-aaa] authentication-scheme AUTH-PPPOE
[BNG-aaa-authen-AUTH-PPPOE] authentication-mode radius
[BNG-aaa-authen-AUTH-PPPOE] quit

# Autenticação com fallback local
[BNG-aaa] authentication-scheme AUTH-FALLBACK
[BNG-aaa-authen-AUTH-FALLBACK] authentication-mode radius local
[BNG-aaa-authen-AUTH-FALLBACK] quit
```

## Criar Esquema de Contabilidade

```bash
[BNG-aaa] accounting-scheme ACC-PPPOE
[BNG-aaa-accounting-ACC-PPPOE] accounting-mode radius
[BNG-aaa-accounting-ACC-PPPOE] accounting realtime 15
[BNG-aaa-accounting-ACC-PPPOE] quit

# Sem contabilidade
[BNG-aaa] accounting-scheme ACC-NONE
[BNG-aaa-accounting-ACC-NONE] accounting-mode none
[BNG-aaa-accounting-ACC-NONE] quit
```

## Criar Esquema de Autorização

```bash
[BNG-aaa] authorization-scheme AUTHOR-PPPOE
[BNG-aaa-author-AUTHOR-PPPOE] authorization-mode radius
[BNG-aaa-author-AUTHOR-PPPOE] quit
```

## Configurações Globais AAA

```bash
[BNG-aaa] # Tempo máximo de espera de resposta do RADIUS
[BNG-aaa] radius-server timeout 5
[BNG-aaa] radius-server retransmit 3

# Habilitar CoA (Change of Authorization)
[BNG-aaa] authorization-scheme AUTHOR-PPPOE
[BNG-aaa-author-AUTHOR-PPPOE] authorization-cmd enable
[BNG-aaa-author-AUTHOR-PPPOE] quit
[BNG-aaa] quit
[BNG] commit
```

## Verificar AAA

```bash
<BNG> display aaa configuration
<BNG> display aaa authentication-scheme
<BNG> display aaa accounting-scheme
<BNG> display aaa authorization-scheme
```
