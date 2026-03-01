<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-md q-pa-lg" style="max-width: 350px; width: 100%">
      <q-avatar size="70px" color="dark" text-color="white" icon="person_add" />

      <div class="text-center">
        <div class="text-h5 text-weight-bold">{{ $t('auth.newAccount') }}</div>
        <div class="text-caption text-grey">{{ $t('auth.registerSubtitle') }}</div>
      </div>

      <q-form @submit.prevent="onRegister" class="full-width q-gutter-sm">
        <q-input v-model="email" :label="$t('auth.email')" outlined dense type="email"
          :rules="[val => !!val || $t('auth.emailRequired')]" />

        <q-input v-model="password" :label="$t('auth.password')" outlined dense
          :type="showPassword ? 'text' : 'password'" :rules="[
            val => !!val || $t('auth.passwordRequired'),
            val => val.length >= 8 || $t('auth.passwordMinLength'),
            val => /[0-9]/.test(val) || $t('auth.passwordNeedsNumber'),
            val => /[A-Z]/.test(val) || $t('auth.passwordNeedsUppercase'),
          ]">
          <template v-slot:append>
            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="showPassword = !showPassword" />
          </template>
        </q-input>

        <q-input v-model="confirmPassword" :label="$t('auth.confirmPassword')" outlined dense
          :type="showPassword ? 'text' : 'password'"
          :rules="[val => !!val || $t('auth.confirmPasswordRequired'), val => val === password || $t('auth.passwordMismatch')]" />

        <q-btn type="submit" :label="$t('auth.createAccount')" color="dark" unelevated rounded
          class="full-width q-mt-md" no-caps :loading="loading" />
      </q-form>

      <div class="text-center text-caption q-mt-sm">
        {{ $t('auth.alreadyHaveAccount') }}
        <router-link to="/login" class="text-dark text-weight-bold" style="text-decoration: none">
          {{ $t('auth.loginLink') }}
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
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onRegister() {
  if (password.value !== confirmPassword.value) {
    Notify.create({ message: t('auth.passwordMismatch'), color: 'negative' })
    return
  }

  loading.value = true
  try {
    const result = await auth.register(email.value, password.value)
    if (result.success) {
      Notify.create({ message: t('auth.registerSuccess'), color: 'positive' })
      router.push('/dashboard')
    } else {
      Notify.create({ message: result.error, color: 'negative' })
    }
  } catch {
    Notify.create({ message: 'একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।', color: 'negative' })
  } finally {
    loading.value = false
  }
}
</script>
