# Como Contribuir

O PacketWiki é um projeto **100% aberto e colaborativo**. Qualquer pessoa pode adicionar, corrigir ou melhorar o conteúdo — seja abrindo um Pull Request no GitHub ou enviando sugestões por e-mail.

---

## Formas de Contribuir

### 1. Editar uma página existente

Em qualquer página, clique no link **"Editar esta página no GitHub"** no rodapé. Isso abre o arquivo direto no GitHub onde você pode propor alterações via Pull Request — sem precisar clonar o repositório.

### 2. Adicionar nova página via GitHub

1. Faça um **fork** do repositório em [github.com/EmersonRicard0/packetwiki](https://github.com/EmersonRicard0/packetwiki)
2. Clone o fork localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/packetwiki.git
   cd packetwiki
   npm install
   npm run docs:dev
   ```
3. Crie o arquivo `.md` no diretório correto (ex: `docs/pt/switches/cisco/catalyst-2960.md`)
4. Use o [template de equipamento](#template-de-equipamento) abaixo
5. Adicione a entrada no sidebar em `docs/.vitepress/sidebars/pt.ts`
6. Abra um **Pull Request** descrevendo o que foi adicionado

### 3. Reportar erro ou sugestão via GitHub

Abra uma [Issue no GitHub](https://github.com/EmersonRicard0/packetwiki/issues) descrevendo o problema ou sugestão.

### 4. Enviar conteúdo por e-mail

Prefere contribuir sem usar o GitHub? Sem problema! Envie o conteúdo para:

📧 **[silvaemerson797@gmail.com](mailto:silvaemerson797@gmail.com)**

Formatos aceitos por e-mail:
- Arquivo `.md` (Markdown)
- Documento de texto simples (`.txt`)
- Texto no corpo do e-mail
- Arquivo Word ou PDF (iremos converter)

Inclua no e-mail:
- **Equipamento:** fabricante e modelo
- **Firmware/versão testada** (quando souber)
- **Seu nome** (para crédito na página, se desejar)

---

## Template de Equipamento

Ao adicionar uma nova página de equipamento, use esta estrutura:

```markdown
# Fabricante Modelo — Nome do Equipamento

Breve descrição do equipamento, seu posicionamento no mercado e casos de uso.

## Especificações Técnicas

| Característica | Valor |
|----------------|-------|
| Processador | ... |
| RAM | ... |
| Interfaces | ... |
| Sistema Operacional | ... |
| Firmware testado | ... |

## Acesso Inicial

### Padrões de fábrica

| Parâmetro | Valor |
|-----------|-------|
| IP | ... |
| Usuário | ... |
| Senha | ... |

### Passo a passo

...

## Reset de Fábrica

...

## Configuração Básica

...

## Comandos Úteis / Referência Rápida

| Objetivo | Comando |
|----------|---------|
| ... | ... |

## Problemas Comuns

...

## Veja Também

- Links relacionados
```

---

## Regras de Contribuição

- Escreva de forma **clara e objetiva**
- Sempre **teste os comandos** antes de publicar
- Indique a **versão do firmware/software** quando relevante
- Use blocos de código (` ``` `) para todos os comandos CLI
- Sem promoção comercial — o conteúdo deve ser técnico e neutro
- Respeite a estrutura de diretórios existente

---

## Dúvidas?

- Abra uma [discussão no GitHub](https://github.com/EmersonRicard0/packetwiki/discussions)
- Ou envie um e-mail para **[silvaemerson797@gmail.com](mailto:silvaemerson797@gmail.com)**
