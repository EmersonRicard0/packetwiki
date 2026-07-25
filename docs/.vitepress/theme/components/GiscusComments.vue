<template>
  <div class="giscus-wrapper">
    <div class="giscus-divider">
      <span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z"/></svg>
        Comentários e Discussão
      </span>
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
