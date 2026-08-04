import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import GiscusComments from './components/GiscusComments.vue'
import WikiChat from './components/WikiChat.vue'
import ZabbixConverter from './components/ZabbixConverter.vue'
import ZabbixRegexTester from './components/ZabbixRegexTester.vue'
import ZabbixMacroCalc from './components/ZabbixMacroCalc.vue'
import ZabbixMigrator from './components/ZabbixMigrator.vue'
import ZabbixIaCExporter from './components/ZabbixIaCExporter.vue'
import ZabbixPluginManager from './components/ZabbixPluginManager.vue'
import ZabbixAIAssistant from './components/ZabbixAIAssistant.vue'
import ZabbixTemplateExplainer from './components/ZabbixTemplateExplainer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComments),
      'layout-bottom': () => h(WikiChat),
    })
  },
  enhanceApp({ app }) {
    app.component('ZabbixConverter', ZabbixConverter)
    app.component('ZabbixRegexTester', ZabbixRegexTester)
    app.component('ZabbixMacroCalc', ZabbixMacroCalc)
    app.component('ZabbixMigrator', ZabbixMigrator)
    app.component('ZabbixIaCExporter', ZabbixIaCExporter)
    app.component('ZabbixPluginManager', ZabbixPluginManager)
    app.component('ZabbixAIAssistant', ZabbixAIAssistant)
    app.component('ZabbixTemplateExplainer', ZabbixTemplateExplainer)
  },
}
