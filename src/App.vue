<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useSettingsStore } from 'stores/settingsStore'

const settings = useSettingsStore()

const loadedFonts = new Set()

function loadGoogleFont(fontName) {
  if (loadedFonts.has(fontName)) return
  loadedFonts.add(fontName)
  const encoded = fontName.replace(/ /g, '+')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
}

function applyFont(fontName) {
  loadGoogleFont(fontName)
  document.body.style.fontFamily = `'${fontName}', 'Noto Sans Bengali', Arial, sans-serif`
}

watch(() => settings.fontFamily, (font) => {
  applyFont(font)
})

onMounted(() => {
  applyFont(settings.fontFamily)
})
</script>
