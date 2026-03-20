import { defineConfig } from 'vitepress'
import { ptSidebar } from './sidebars/pt'

export default defineConfig({
  title: 'PacketWiki',
  description: 'A wiki open source da comunidade de redes e servidores Linux',
  lang: 'pt-BR',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'PacketWiki' }],
    ['meta', { property: 'og:image', content: 'https://wiki.ertechnol.com.br/hero.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://wiki.ertechnol.com.br/hero.svg' }],
  ],

  sitemap: {
    hostname: 'https://wiki.ertechnol.com.br',
  },

  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Início', link: '/pt/' },
      { text: 'Roteadores', link: '/pt/roteadores/' },
      { text: 'Switches', link: '/pt/switches/' },
      { text: 'OLT', link: '/pt/olt/' },
      { text: 'Servidores Linux', link: '/pt/linux/' },
      { text: 'Serviços', link: '/pt/servicos/' },
      { text: 'Glossário', link: '/pt/glossario' },
      { text: 'Contribuir', link: '/pt/contribuir' },
      { text: 'Sobre', link: '/pt/sobre' },
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
