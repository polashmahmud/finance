<template>
  <q-page class="flex flex-center q-pa-md bg-white">
    <div style="width: 100%; max-width: 400px">
      <!-- Header -->
      <div class="text-center q-mb-xl">
        <q-btn flat round dense icon="arrow_back" color="grey-7" class="absolute-top-left q-ma-md" @click="$router.push('/login')" />
        <div class="text-h5 text-weight-bold q-mt-lg" style="color: #111;">নতুন একাউন্ট</div>
        <div class="text-subtitle1 text-grey-7">তথ্য দিয়ে একাউন্ট তৈরি করুন</div>
      </div>

      <!-- Registration Form -->
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
          :rules="[
            (val) => (val && val.length > 0) || 'পাসওয়ার্ড আবশ্যক',
            (val) => val.length >= 6 || 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
          ]"
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

        <q-input
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          label="পাসওয়ার্ড নিশ্চিত করুন"
          outlined
          hide-bottom-space
          color="primary"
          bg-color="grey-1"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'পাসওয়ার্ড নিশ্চিত করা আবশ্যক',
            (val) => val === password || 'পাসওয়ার্ড মিলছে না'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock_outline" color="grey-6" />
          </template>
        </q-input>

        <div class="q-mt-lg">
          <q-btn
            label="একাউন্ট তৈরি করুন"
            type="submit"
            class="full-width bg-primary-gradient shadow-3"
            text-color="white"
            size="lg"
            rounded
            :loading="loading"
          />
        </div>
      </q-form>

      <!-- Login Link -->
      <div class="text-center q-mt-lg">
        <span class="text-grey-7">আগে থেকেই একাউন্ট আছে? </span>
        <router-link to="/login" class="text-weight-bold text-primary" style="text-decoration: none">
          লগইন করুন
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
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  const result = await authStore.register(email.value, password.value)
  loading.value = false

  if (result.success) {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
      position: 'top',
    })
    router.push('/')
  } else {
    $q.notify({
      color: 'negative',
      icon: 'warning',
      message: 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে: ' + result.error,
      position: 'top',
    })
  }
}
</script>
