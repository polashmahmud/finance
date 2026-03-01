<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-md q-pa-lg" style="max-width: 350px; width: 100%">
      <q-avatar size="70px" color="dark" text-color="white" icon="account_balance_wallet" />

      <div class="text-center">
        <div class="text-h5 text-weight-bold">{{ $t('auth.welcome') }}</div>
        <div class="text-caption text-grey">{{ $t('auth.loginSubtitle') }}</div>
      </div>

      <q-form @submit.prevent="onLogin" class="full-width q-gutter-sm">
        <q-input v-model="email" :label="$t('auth.email')" outlined dense type="email"
          :rules="[val => !!val || $t('auth.emailRequired')]" />

        <q-input v-model="password" :label="$t('auth.password')" outlined dense
          :type="showPassword ? 'text' : 'password'" :rules="[val => !!val || $t('auth.passwordRequired')]">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showPassword = !showPassword" />
          </template>
        </q-input>

        <q-btn type="submit" :label="$t('auth.login')" color="dark" unelevated rounded class="full-width q-mt-md"
          no-caps :loading="loading" />
      </q-form>

      <div class="text-center text-caption q-mt-sm">
        {{ $t('auth.noAccount') }}
        <router-link to="/register" class="text-dark text-weight-bold" style="text-decoration: none">
          {{ $t('auth.createNewAccount') }}
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onLogin() {
  loading.value = true
  try {
    const result = await auth.login(email.value, password.value)
    if (result.success) {
      Notify.create({ message: t('auth.loginSuccess'), color: 'positive' })
      if (settings.appLock) {
        router.push('/splash')
      } else {
        router.push('/dashboard')
      }
    } else {
      Notify.create({ message: result.error, color: 'negative' })
    }
  } catch {
    Notify.create({ message: t('auth.loginFailed') + 'একটি ত্রুটি ঘটেছে।', color: 'negative' })
  } finally {
    loading.value = false
  }
}
</script>
