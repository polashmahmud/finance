<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">সেটিংস</div>
    </div>

    <!-- Profile Section -->
    <q-card class="finance-card q-mb-md">
      <q-list>
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-avatar color="dark" text-color="white" size="48px">
              <q-icon name="person" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">ব্যবহারকারী</q-item-label>
            <q-item-label caption>আপনার প্রোফাইল পরিচালনা করুন</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Preferences Section -->
    <div class="section-title">পছন্দসমূহ</div>
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <!-- Currency -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="payments" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>মুদ্রা</q-item-label>
            <q-item-label caption>{{ settings.currencyCode }} ({{ settings.currency }})</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select
              v-model="selectedCurrency"
              :options="currencyOptions"
              dense
              borderless
              emit-value
              map-options
              @update:model-value="onCurrencyChange"
              style="min-width: 100px"
            />
          </q-item-section>
        </q-item>

        <!-- Language -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="language" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ভাষা</q-item-label>
            <q-item-label caption>{{ settings.language === 'en' ? 'English' : 'বাংলা' }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select
              v-model="selectedLang"
              :options="[
                { label: 'English', value: 'en' },
                { label: 'বাংলা', value: 'bn' },
              ]"
              dense
              borderless
              emit-value
              map-options
              @update:model-value="settings.setLanguage($event)"
              style="min-width: 100px"
            />
          </q-item-section>
        </q-item>

        <!-- Dark Mode -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="dark_mode" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ডার্ক মোড</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="settings.darkMode"
              color="dark"
              @update:model-value="settings.toggleDarkMode()"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Security Section -->
    <div class="section-title">নিরাপত্তা</div>
    <q-card class="finance-card q-mb-md">
      <q-list>
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="lock" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>অ্যাপ লক (পিন)</q-item-label>
            <q-item-label caption>{{ settings.appLock ? 'সক্রিয়' : 'নিষ্ক্রিয়' }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              dense
              :label="settings.appLock ? 'পরিবর্তন' : 'পিন সেট করুন'"
              color="dark"
              @click="showPinDialog = true"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Data Section -->
    <div class="section-title">ডেটা</div>
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <q-item clickable class="touch-target">
          <q-item-section avatar>
            <q-icon name="backup" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ব্যাকআপ</q-item-label>
            <q-item-label caption>লোকাল ব্যাকআপ</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="touch-target">
          <q-item-section avatar>
            <q-icon name="file_download" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ডেটা এক্সপোর্ট</q-item-label>
            <q-item-label caption>CSV / PDF</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Category & About -->
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <q-item clickable class="touch-target" @click="$router.push('/categories')">
          <q-item-section avatar>
            <q-icon name="category" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ক্যাটাগরি ও বাজেট</q-item-label>
            <q-item-label caption>ক্যাটাগরি ও বাজেট পরিচালনা</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="info" color="grey" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ব্যক্তিগত ফাইন্যান্স ম্যানেজার</q-item-label>
            <q-item-label caption>সংস্করণ ১.০.০</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Logout -->
    <q-card class="finance-card q-mb-md cursor-pointer" @click="onLogout" v-ripple>
      <q-list>
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium text-negative">লগআউট</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Set PIN Dialog -->
    <q-dialog v-model="showPinDialog">
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">পিন সেট করুন</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newPin"
            label="৪ সংখ্যার পিন দিন"
            type="password"
            maxlength="4"
            outlined
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="বাতিল" v-close-popup />
          <q-btn
            unelevated
            color="dark"
            label="সংরক্ষণ করুন"
            @click="savePin"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'stores/settingsStore'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

const router = useRouter()
const settings = useSettingsStore()
const authStore = useAuthStore()

const selectedCurrency = ref(settings.currencyCode)
const selectedLang = ref(settings.language)
const showPinDialog = ref(false)
const newPin = ref('')

const currencyOptions = [
  { label: 'BDT (৳)', value: 'BDT' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'INR (₹)', value: 'INR' },
]

const currencySymbols = { BDT: '৳', USD: '$', EUR: '€', GBP: '£', INR: '₹' }

function onCurrencyChange(code) {
  settings.setCurrency(currencySymbols[code] || code, code)
}

function savePin() {
  if (newPin.value.length !== 4) {
    Notify.create({ type: 'warning', message: 'পিন অবশ্যই ৪ সংখ্যার হতে হবে' })
    return
  }
  settings.setPin(newPin.value)
  newPin.value = ''
  showPinDialog.value = false
  Notify.create({ type: 'positive', message: 'পিন সফলভাবে সেট হয়েছে' })
}

async function onLogout() {
  const result = await authStore.logout()
  if (result.success) {
    Notify.create({ type: 'positive', icon: 'check_circle', message: 'লগআউট সফল হয়েছে', position: 'top' })
    router.push('/login')
  }
}
</script>
