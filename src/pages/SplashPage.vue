<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-md text-center q-pa-lg" style="max-width: 320px">
      <!-- Logo -->
      <q-avatar size="80px" color="dark" text-color="white" icon="account_balance_wallet" />

      <div>
        <div class="text-h5 text-weight-bold">{{ $t('splash.title') }}</div>
        <div class="text-caption text-grey">{{ $t('splash.subtitle') }}</div>
      </div>

      <!-- Dark mode -->
      <div class="row items-center q-gutter-sm">
        <q-icon name="dark_mode" size="20px" />
        <span class="text-body2">{{ $t('common.darkMode') }}</span>
        <q-toggle v-model="isDark" color="dark" />
      </div>

      <!-- PIN Lock -->
      <template v-if="settings.pin">
        <q-input v-model="pinInput" :label="$t('splash.enterPin')" outlined dense rounded type="password" mask="####"
          class="full-width" @keyup.enter="unlockApp" />
        <q-btn :label="$t('splash.unlock')" color="dark" unelevated rounded class="full-width" no-caps
          @click="unlockApp" :disable="pinInput.length !== 4" />
      </template>

      <!-- No PIN -->
      <q-btn v-else :label="$t('splash.start')" color="dark" unelevated rounded class="full-width" no-caps
        @click="goHome" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'stores/settingsStore'
import { useQuasar, Notify } from 'quasar'

useI18n()
const router = useRouter()
const settings = useSettingsStore()
const $q = useQuasar()

const isDark = ref($q.dark.isActive)
const pinInput = ref('')

// Watch dark mode toggle
import { watch } from 'vue'
watch(isDark, (val) => {
  $q.dark.set(val)
})

function unlockApp() {
  if (pinInput.value === settings.pin) {
    router.push('/')
  } else {
    Notify.create({ message: 'Incorrect PIN', color: 'negative' })
    pinInput.value = ''
  }
}

function goHome() {
  router.push('/')
}
</script>
