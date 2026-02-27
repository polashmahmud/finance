<template>
  <div class="fullscreen bg-white text-dark text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        4<span class="text-dark">0</span>4
      </div>

      <p class="text-h5" style="opacity:.4">
        {{ $t('error.notFound') }}
      </p>

      <q-btn class="q-mt-xl" color="dark" unelevated no-caps rounded :label="$t('error.goHome')" to="/" />
    </div>
  </div>

</template>

<script setup>
import { useI18n } from 'vue-i18n'
useI18n()
</script>
