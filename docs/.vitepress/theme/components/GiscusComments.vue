<template>
  <div class="giscus-wrapper">
    <div class="giscus-divider">
      <span>💬 Comentários e Discussão</span>
    </div>
    <div ref="giscusContainer" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const giscusContainer = ref(null)
const route = useRoute()
const { isDark } = useData()

function loadGiscus() {
  if (!giscusContainer.value) return

  // Remove script anterior se existir
  const existing = giscusContainer.value.querySelector('script')
  if (existing) existing.remove()

  // Limpa iframe anterior
  const iframe = document.querySelector('iframe.giscus-frame')
  if (iframe) iframe.remove()

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'EmersonRicard0/packetwiki')
  script.setAttribute('data-repo-id', 'R_kgDORsNWtg')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDORsNWts4C440_')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'pt')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  giscusContainer.value.appendChild(script)
}

function updateTheme() {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (!iframe) return
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
    'https://giscus.app'
  )
}

onMounted(() => {
  loadGiscus()
})

watch(
  () => route.path,
  () => {
    loadGiscus()
  }
)

watch(isDark, () => {
  updateTheme()
})
</script>

<style scoped>
.giscus-wrapper {
  margin-top: 3rem;
  padding-top: 1.5rem;
}

.giscus-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
}

.giscus-divider::before,
.giscus-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}
</style>
