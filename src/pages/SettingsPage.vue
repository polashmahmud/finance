<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">{{ $t('settings.title') }}</div>
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
            <q-item-label class="text-weight-medium">{{ $t('settings.user') }}</q-item-label>
            <q-item-label caption>{{ $t('settings.manageProfile') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Preferences Section -->
    <div class="section-title">{{ $t('settings.preferences') }}</div>
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <!-- Currency -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="payments" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.currency') }}</q-item-label>
            <q-item-label caption>{{ settings.currencyCode }} ({{ settings.currency }})</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="selectedCurrency" :options="currencyOptions" dense borderless emit-value map-options
              @update:model-value="onCurrencyChange" style="min-width: 100px" />
          </q-item-section>
        </q-item>

        <!-- Language -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="language" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.language') }}</q-item-label>
            <q-item-label caption>{{ settings.language === 'en' ? 'English' : 'বাংলা' }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="selectedLang" :options="[
              { label: 'English', value: 'en' },
              { label: 'বাংলা', value: 'bn' },
            ]" dense borderless emit-value map-options @update:model-value="onLanguageChange"
              style="min-width: 100px" />
          </q-item-section>
        </q-item>

        <!-- Dark Mode -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="dark_mode" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('common.darkMode') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :model-value="settings.darkMode" color="dark" @update:model-value="settings.toggleDarkMode()" />
          </q-item-section>
        </q-item>

        <!-- Font -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="text_fields" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.font') }}</q-item-label>
            <q-item-label caption :style="{ fontFamily: settings.fontFamily }">{{ settings.fontFamily }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-select v-model="selectedFont" :options="fontOptions" dense borderless emit-value map-options
              @update:model-value="onFontChange" style="min-width: 140px">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label :style="{ fontFamily: scope.opt.value + ', sans-serif' }">{{ scope.opt.label
                      }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Security Section -->
    <div class="section-title">{{ $t('settings.security') }}</div>
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <!-- App Lock Toggle -->
        <q-item class="touch-target">
          <q-item-section avatar>
            <q-icon name="lock" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.appLockPin') }}</q-item-label>
            <q-item-label caption>{{ settings.appLock ? $t('settings.active') : $t('settings.inactive')
              }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :model-value="settings.appLock" color="dark" @update:model-value="onToggleAppLock" />
          </q-item-section>
        </q-item>

        <!-- Change PIN (only when active) -->
        <q-item v-if="settings.appLock" clickable class="touch-target" @click="showChangePinDialog = true">
          <q-item-section avatar>
            <q-icon name="pin" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.change') }} PIN</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Data Section -->
    <div class="section-title">{{ $t('settings.data') }}</div>
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <q-item clickable class="touch-target">
          <q-item-section avatar>
            <q-icon name="backup" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.backup') }}</q-item-label>
            <q-item-label caption>{{ $t('settings.localBackup') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="touch-target">
          <q-item-section avatar>
            <q-icon name="file_download" color="dark" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('settings.dataExport') }}</q-item-label>
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
            <q-item-label>{{ $t('settings.categoryAndBudget') }}</q-item-label>
            <q-item-label caption>{{ $t('settings.categoryAndBudgetManage') }}</q-item-label>
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
            <q-item-label>{{ $t('settings.appName') }}</q-item-label>
            <q-item-label caption>{{ $t('settings.version') }}</q-item-label>
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
            <q-item-label class="text-weight-medium text-negative">{{ $t('common.logout') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Set PIN Dialog -->
    <q-dialog v-model="showPinDialog">
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ $t('settings.setPin') }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newPin" :label="$t('settings.newPinLabel')" type="password" maxlength="4" mask="####"
            outlined autofocus />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" v-close-popup />
          <q-btn unelevated color="dark" :label="$t('common.save')" @click="savePin" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Change PIN Dialog -->
    <q-dialog v-model="showChangePinDialog">
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ $t('settings.change') }} PIN</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="currentPinInput" :label="$t('settings.enterCurrentPin')" type="password" maxlength="4"
            mask="####" outlined autofocus />
          <q-input v-model="newPin" :label="$t('settings.newPinLabel')" type="password" maxlength="4" mask="####"
            outlined />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" v-close-popup />
          <q-btn unelevated color="dark" :label="$t('common.save')" @click="changePin" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Remove PIN Dialog -->
    <q-dialog v-model="showRemovePinDialog">
      <q-card style="min-width: 300px; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-weight-bold">{{ $t('settings.removePin') }}</div>
          <div class="text-caption text-grey q-mt-xs">{{ $t('settings.removePinConfirm') }}</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="currentPinInput" :label="$t('settings.enterCurrentPin')" type="password" maxlength="4"
            mask="####" outlined autofocus />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" v-close-popup />
          <q-btn unelevated color="negative" :label="$t('settings.removePin')" @click="removePinConfirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'stores/settingsStore'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

const { t } = useI18n()
const router = useRouter()
const settings = useSettingsStore()
const authStore = useAuthStore()

const selectedCurrency = ref(settings.currencyCode)
const selectedLang = ref(settings.language)
const selectedFont = ref(settings.fontFamily)
const showPinDialog = ref(false)
const showChangePinDialog = ref(false)
const showRemovePinDialog = ref(false)
const newPin = ref('')
const currentPinInput = ref('')

const currencyOptions = [
  { label: 'BDT (৳)', value: 'BDT' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'GBP (£)', value: 'GBP' },
  { label: 'INR (₹)', value: 'INR' },
]

const fontOptions = [
  { label: 'Tiro Bangla', value: 'Tiro Bangla' },
  { label: 'Noto Sans Bengali', value: 'Noto Sans Bengali' },
  { label: 'Hind Siliguri', value: 'Hind Siliguri' },
  { label: 'Baloo Da 2', value: 'Baloo Da 2' },
  { label: 'Galada', value: 'Galada' },
  { label: 'Noto Serif Bengali', value: 'Noto Serif Bengali' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
]

const currencySymbols = { BDT: '৳', USD: '$', EUR: '€', GBP: '£', INR: '₹' }

function onCurrencyChange(code) {
  settings.setCurrency(currencySymbols[code] || code, code)
}

function onLanguageChange(lang) {
  settings.setLanguage(lang)
}

function onFontChange(font) {
  settings.setFont(font)
}

// --- PIN Logic ---

function onToggleAppLock(val) {
  if (val) {
    // Turning ON → set new PIN
    newPin.value = ''
    showPinDialog.value = true
  } else {
    // Turning OFF → confirm with current PIN
    currentPinInput.value = ''
    showRemovePinDialog.value = true
  }
}

function savePin() {
  if (newPin.value.length !== 4) {
    Notify.create({ type: 'warning', message: t('settings.pinMustBe4') })
    return
  }
  settings.setPin(newPin.value)
  newPin.value = ''
  showPinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinSetSuccess') })
}

function changePin() {
  if (!settings.verifyPin(currentPinInput.value)) {
    Notify.create({ type: 'negative', message: t('settings.wrongPin') })
    return
  }
  if (newPin.value.length !== 4) {
    Notify.create({ type: 'warning', message: t('settings.pinMustBe4') })
    return
  }
  settings.setPin(newPin.value)
  newPin.value = ''
  currentPinInput.value = ''
  showChangePinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinSetSuccess') })
}

function removePinConfirm() {
  if (!settings.verifyPin(currentPinInput.value)) {
    Notify.create({ type: 'negative', message: t('settings.wrongPin') })
    return
  }
  settings.removePin()
  currentPinInput.value = ''
  showRemovePinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinRemoved') })
}

async function onLogout() {
  settings.lock()
  const result = await authStore.logout()
  if (result.success) {
    Notify.create({ type: 'positive', icon: 'check_circle', message: t('common.logoutSuccess'), position: 'top' })
    router.push('/login')
  }
}
</script>
