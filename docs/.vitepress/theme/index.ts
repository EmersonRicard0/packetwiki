import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import GiscusComments from './components/GiscusComments.vue'
import WikiChat from './components/WikiChat.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComments),
      'layout-bottom': () => h(WikiChat),
    })
  },
}
