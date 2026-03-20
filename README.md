# PacketWiki

> Wiki open source da comunidade de redes — guias de configuração para roteadores, switches, OLTs e servidores Linux.

**🌐 Site:** https://emersonricard0.github.io/packetwiki

[![Deploy](https://github.com/EmersonRicard0/packetwiki/actions/workflows/deploy.yml/badge.svg)](https://github.com/EmersonRicard0/packetwiki/actions/workflows/deploy.yml)

---

## Sobre

O PacketWiki é uma wiki técnica colaborativa focada em ISPs e infraestrutura de rede. Todo o conteúdo é escrito em Markdown e qualquer pessoa pode contribuir.

### O que tem aqui

| Seção | Fabricantes / Temas |
|-------|-------------------|
| **Roteadores** | Huawei NE, MikroTik CCR, Cisco, Juniper, Ubiquiti |
| **Switches** | Huawei CloudEngine, Datacom, Cisco Catalyst, HP/Aruba |
| **OLT / GPON** | Huawei MA5800, Datacom |
| **Serviços** | Zabbix, Grafana, Prometheus, FreeRADIUS (Docker e nativo) |
| **Linux** | Firewall, DHCP, WireGuard, monitoramento |
| **Glossário** | Termos técnicos de redes, ISP e óptica |

Disponível em **Português (BR)** 🇧🇷 e **English** 🇺🇸

---

## Rodar Localmente

```bash
# Clonar o repositório
git clone https://github.com/EmersonRicard0/packetwiki.git
cd packetwiki

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run docs:dev
```

Acesse: http://localhost:5173

### Build de produção

```bash
npm run docs:build
npm run docs:preview
```

---

## Estrutura do Projeto

```
docs/
├── .vitepress/
│   ├── config.ts          # Configuração principal
│   ├── theme/             # CSS e tema customizado
│   └── sidebars/
│       ├── pt.ts          # Sidebar em português
│       └── en.ts          # Sidebar em inglês
├── pt/                    # Conteúdo em português
│   ├── roteadores/
│   ├── switches/
│   ├── olt/
│   ├── servicos/
│   ├── linux/
│   └── glossario.md
├── public/                # Assets estáticos (logo, hero)
└── index.md               # Home em inglês
```

---

## Contribuir

Contribuições são muito bem-vindas! Você pode:

- **Editar uma página** — clique em "Editar esta página no GitHub" em qualquer artigo
- **Abrir uma Issue** — para reportar erro ou sugerir novo conteúdo
- **Abrir um Pull Request** — para adicionar páginas novas
- **Enviar por e-mail** — [silvaemerson797@gmail.com](mailto:silvaemerson797@gmail.com)

Veja o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md) ou na [página de contribuição](https://emersonricard0.github.io/packetwiki/pt/contribuir).

---

## Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| [VitePress 1.x](https://vitepress.dev) | Static site generator |
| TypeScript | Configuração e sidebars |
| GitHub Actions | CI/CD e deploy automático |
| GitHub Pages | Hospedagem gratuita |

---

## Licença

MIT License — veja [LICENSE](LICENSE)

---

*Feito com ❤️ pela comunidade de redes brasileira*
