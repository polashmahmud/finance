<template>
  <q-page class="flex flex-center column" style="padding-bottom: 0; background: linear-gradient(135deg, #43A047 0%, #26A69A 100%)">
    <div class="text-center text-white q-pa-xl">
      <!-- Logo -->
      <q-icon name="account_balance_wallet" size="80px" class="q-mb-lg" />

      <h4 class="q-mt-md q-mb-xs text-weight-bold">ব্যক্তিগত ফাইন্যান্স</h4>
      <p class="text-subtitle1 q-mb-xl" style="opacity: 0.85">আপনার অর্থ স্মার্টভাবে পরিচালনা করুন</p>

      <!-- PIN Input -->
      <div v-if="settings.appLock && !authenticated" class="q-mt-xl">
        <p class="text-body2 q-mb-md">চালিয়ে যেতে পিন দিন</p>
        <div class="row justify-center q-gutter-sm q-mb-lg">
          <q-input
            v-for="i in 4"
            :key="i"
            v-model="pinDigits[i - 1]"
            type="password"
            maxlength="1"
            dense
            outlined
            dark
            input-class="text-center text-h5"
            style="width: 56px"
            @update:model-value="onPinInput(i - 1)"
            :ref="(el) => (pinRefs[i - 1] = el)"
          />
        </div>
        <q-btn
          flat
          label="আনলক"
          text-color="white"
          class="q-px-xl"
          @click="verifyPin"
        />
      </div>

      <!-- Regular entry -->
      <div v-else class="q-mt-xl">
        <q-btn
          unelevated
          rounded
          color="white"
          text-color="primary"
          label="শুরু করুন"
          class="q-px-xl q-py-sm text-weight-bold"
          size="lg"
          @click="enter"
        />

        <div class="q-mt-lg">
          <q-toggle
            v-model="isDark"
            color="accent"
            label="ডার্ক মোড"
            dark
            @update:model-value="settings.setDarkMode($event)"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'stores/settingsStore'

const router = useRouter()
const settings = useSettingsStore()

const isDark = ref(settings.darkMode)
const authenticated = ref(!settings.appLock)
const pinDigits = ref(['', '', '', ''])
const pinRefs = ref([])

function onPinInput(index) {
  if (pinDigits.value[index] && index < 3) {
    pinRefs.value[index + 1]?.focus()
  }
}

function verifyPin() {
  const entered = pinDigits.value.join('')
  if (entered === settings.pin) {
    settings.authenticate()
    authenticated.value = true
    enter()
  } else {
    pinDigits.value = ['', '', '', '']
    pinRefs.value[0]?.focus()
  }
}

function enter() {
  settings.authenticate()
  router.push('/')
}
</script>
