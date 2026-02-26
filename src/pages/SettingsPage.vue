<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">Settings</div>
    </div>

    <q-list>
      <!-- Profile -->
      <q-item-label header class="text-weight-bold">Profile</q-item-label>
      <q-item class="touch-target">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" size="48px">
            <q-icon name="person" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium">User</q-item-label>
          <q-item-label caption>Manage your profile</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Preferences -->
      <q-item-label header class="text-weight-bold">Preferences</q-item-label>

      <!-- Currency -->
      <q-item class="touch-target">
        <q-item-section avatar>
          <q-icon name="payments" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Currency</q-item-label>
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
          <q-icon name="language" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Language</q-item-label>
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
          <q-icon name="dark_mode" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dark Mode</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            :model-value="settings.darkMode"
            color="primary"
            @update:model-value="settings.toggleDarkMode()"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Security -->
      <q-item-label header class="text-weight-bold">Security</q-item-label>

      <!-- App Lock -->
      <q-item class="touch-target">
        <q-item-section avatar>
          <q-icon name="lock" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>App Lock (PIN)</q-item-label>
          <q-item-label caption>{{ settings.appLock ? 'Enabled' : 'Disabled' }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            :label="settings.appLock ? 'Change' : 'Set PIN'"
            color="primary"
            @click="showPinDialog = true"
          />
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Data -->
      <q-item-label header class="text-weight-bold">Data</q-item-label>

      <q-item clickable class="touch-target">
        <q-item-section avatar>
          <q-icon name="backup" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Backup</q-item-label>
          <q-item-label caption>Local backup</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable class="touch-target">
        <q-item-section avatar>
          <q-icon name="file_download" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Export Data</q-item-label>
          <q-item-label caption>CSV / PDF</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- Categories Link -->
      <q-item clickable class="touch-target" @click="$router.push('/categories')">
        <q-item-section avatar>
          <q-icon name="category" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Categories & Budget</q-item-label>
          <q-item-label caption>Manage categories and budgets</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <!-- About -->
      <q-item-label header class="text-weight-bold">About</q-item-label>
      <q-item class="touch-target">
        <q-item-section avatar>
          <q-icon name="info" color="grey" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Personal Finance Manager</q-item-label>
          <q-item-label caption>Version 1.0.0</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Set PIN Dialog -->
    <q-dialog v-model="showPinDialog">
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Set PIN</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newPin"
            label="Enter 4-digit PIN"
            type="password"
            maxlength="4"
            outlined
            autofocus
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Save"
            @click="savePin"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from 'stores/settingsStore'
import { Notify } from 'quasar'

const settings = useSettingsStore()

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
    Notify.create({ type: 'warning', message: 'PIN must be 4 digits' })
    return
  }
  settings.setPin(newPin.value)
  newPin.value = ''
  showPinDialog.value = false
  Notify.create({ type: 'positive', message: 'PIN set successfully' })
}
</script>
