import { defineConfig } from 'vitepress'
import { ptSidebar } from './sidebars/pt'
import { enSidebar } from './sidebars/en'

export default defineConfig({
  title: 'PacketWiki',
  description: 'The open community wiki for networking and Linux servers',

  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'PacketWiki' }],
    ['meta', { property: 'og:image', content: 'https://emersonricard0.github.io/packetwiki/hero.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://emersonricard0.github.io/packetwiki/hero.svg' }],
  ],

  sitemap: {
    hostname: 'https://emersonricard0.github.io/packetwiki',
  },

  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  locales: {
    pt: {
      label: 'Português',
      lang: 'pt-BR',
      link: '/pt/',
      title: 'PacketWiki',
      description: 'A wiki open source da comunidade de redes e servidores Linux',
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
        ],
        sidebar: ptSidebar,
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
            locales: {
              pt: {
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
          },
        },
      },
    },

    root: {
      label: 'English',
      lang: 'en-US',
      link: '/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Routers', link: '/routers/' },
          { text: 'Switches', link: '/switches/' },
          { text: 'OLT', link: '/pt/olt/' },
          { text: 'Linux Servers', link: '/linux/' },
          { text: 'Contribute', link: '/contribute' },
        ],
        sidebar: enSidebar,
        editLink: {
          pattern: 'https://github.com/EmersonRicard0/packetwiki/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        lastUpdated: {
          text: 'Last updated',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/EmersonRicard0/packetwiki' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 PacketWiki Community',
    },
  },
})
