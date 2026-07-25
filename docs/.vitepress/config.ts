import { defineConfig } from 'vitepress'
import { ptSidebar } from './sidebars/pt'

export default defineConfig({
  title: 'ERtech',
  titleTemplate: ':title — ERtech',
  description: 'ERtech — observabilidade de ponta a ponta para redes, servidores e infraestrutura crítica. Monitoramento, alertas e performance por Emerson Ricardo.',
  lang: 'pt-BR',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#E53935' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ERtech' }],
    ['meta', { property: 'og:title', content: 'ERtech — Monitoramento, Alertas & Performance' }],
    ['meta', { property: 'og:description', content: 'Observabilidade de ponta a ponta para redes, servidores e infraestrutura crítica. Inclui a PacketWiki — base de conhecimento técnica.' }],
    ['meta', { property: 'og:url', content: 'https://ertechnol.com.br' }],
    ['meta', { property: 'og:image', content: 'https://ertechnol.com.br/hero.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://ertechnol.com.br/hero.svg' }],
  ],

  sitemap: {
    hostname: 'https://ertechnol.com.br',
  },

  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  themeConfig: {
    siteTitle: 'ERtech',

    nav: [
      { text: 'ERtech', link: '/' },
      { text: 'Wiki', link: '/pt/' },
      {
        text: 'Documentação',
        items: [
          { text: 'Roteadores', link: '/pt/roteadores/' },
          { text: 'Switches', link: '/pt/switches/' },
          { text: 'OLT / GPON', link: '/pt/olt/' },
          { text: 'Servidores Linux', link: '/pt/linux/' },
          { text: 'Serviços', link: '/pt/servicos/' },
          { text: 'Scripts', link: '/pt/scripts' },
          { text: 'Glossário', link: '/pt/glossario' },
        ],
      },
      { text: 'Contribuir', link: '/pt/contribuir' },
      { text: 'Sobre', link: '/pt/sobre' },
      { text: 'Contato', link: 'mailto:silvaemerson797@gmail.com' },
    ],

    sidebar: ptSidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EmersonRicard0/packetwiki' },
    ],

    editLink: {
      pattern: 'https://github.com/EmersonRicard0/packetwiki/edit/main/docs/:path',
      text: 'Editar esta página no GitHub',
    },

    lastUpdated: {
      text: 'Atualizado em',
    },

    docFooter: {
      prev: 'Anterior',
      next: 'Próximo',
    },

    outline: {
      label: 'Nesta página',
    },

    returnToTopLabel: 'Voltar ao topo',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Tema',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Pesquisar', buttonAriaLabel: 'Pesquisar' },
          modal: {
            noResultsText: 'Nenhum resultado para',
            resetButtonTitle: 'Limpar pesquisa',
            footer: { selectText: 'selecionar', navigateText: 'navegar', closeText: 'fechar' },
          },
        },
      },
    },

    footer: {
      message: 'Licença MIT.',
      copyright: 'Copyright © 2025 PacketWiki Community',
    },
  },
})
