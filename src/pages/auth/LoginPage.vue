<template>
  <q-page class="flex flex-center q-pa-md bg-white">
    <div style="width: 100%; max-width: 400px">
      <!-- Logo / Header -->
      <div class="text-center q-mb-xl">
        <q-avatar size="72px" class="bg-primary-gradient text-white q-mb-md shadow-3">
          <q-icon name="account_balance_wallet" />
        </q-avatar>
        <div class="text-h5 text-weight-bold" style="color: #111;">স্বাগতম</div>
        <div class="text-subtitle1 text-grey-7">আপনার একাউন্টে লগইন করুন</div>
      </div>

      <!-- Login Form -->
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="email"
          type="email"
          label="ইমেইল"
          outlined
          hide-bottom-space
          color="primary"
          bg-color="grey-1"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'ইমেইল আবশ্যক']"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="grey-6" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="পাসওয়ার্ড"
          outlined
          hide-bottom-space
          color="primary"
          bg-color="grey-1"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'পাসওয়ার্ড আবশ্যক']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-6" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="grey-6"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <div>
          <q-btn
            label="লগইন"
            type="submit"
            class="full-width bg-primary-gradient shadow-3"
            text-color="white"
            size="lg"
            rounded
            :loading="loading"
          />
        </div>
      </q-form>

      <!-- Registration Link -->
      <div class="text-center q-mt-lg">
        <span class="text-grey-7">একাউন্ট নেই? </span>
        <router-link to="/register" class="text-weight-bold text-primary" style="text-decoration: none">
          নতুন একাউন্ট তৈরি করুন
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useQuasar } from 'quasar'

const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  const result = await authStore.login(email.value, password.value)
  loading.value = false

  if (result.success) {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'সফলভাবে লগইন হয়েছে',
      position: 'top',
    })
    router.push('/')
  } else {
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message: 'লগইন ব্যর্থ হয়েছে: ' + result.error,
      position: 'top',
    })
  }
}
</script>
