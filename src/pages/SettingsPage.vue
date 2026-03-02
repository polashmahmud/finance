<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">{{ $t('settings.title') }}</div>
    </div>

    <!-- Responsive 2-column layout on desktop -->
    <div class="row q-col-gutter-lg">
      <!-- LEFT column: Profile + Preferences -->
      <div class="col-12 col-md-6">

        <!-- Profile Section -->
        <q-card class="finance-card q-mb-md">
          <q-list>
            <q-item class="touch-target" clickable @click="openUserProfileModal">
              <q-item-section avatar>
                <q-avatar color="dark" text-color="white" size="48px">
                  <img v-if="authStore.userProfile?.avatar" :src="authStore.userProfile.avatar" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ authStore.userProfile?.name || $t('settings.user') }}
                </q-item-label>
                <q-item-label caption>{{ $t('settings.manageProfile') }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
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
                <q-toggle :model-value="settings.darkMode" color="dark"
                  @update:model-value="settings.toggleDarkMode()" />
              </q-item-section>
            </q-item>

            <!-- Font -->
            <q-item class="touch-target">
              <q-item-section avatar>
                <q-icon name="text_fields" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('settings.font') }}</q-item-label>
                <q-item-label caption :style="{ fontFamily: settings.fontFamily }">{{ settings.fontFamily
                }}</q-item-label>
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

            <!-- Date Format -->
            <q-item class="touch-target">
              <q-item-section avatar>
                <q-icon name="calendar_today" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('settings.dateFormat') }}</q-item-label>
                <q-item-label caption>{{ settings.dateFormat }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select v-model="selectedDateFormat" :options="dateFormatOptions" dense borderless emit-value
                  map-options @update:model-value="onDateFormatChange" style="min-width: 130px" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

      </div>
      <!-- RIGHT column: Security + Dashboard Settings + Data + About -->
      <div class="col-12 col-md-6">

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

            <!-- Change Password -->
            <q-item clickable class="touch-target" @click="showChangePasswordDialog = true">
              <q-item-section avatar>
                <q-icon name="key" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('settings.changePassword') }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Dashboard Settings Section -->
        <div class="section-title">{{ $t('dashboard.myFinance') }}</div>
        <q-card class="finance-card q-mb-md">
          <q-list separator>
            <!-- Dashboard Emojis -->
            <q-item clickable class="touch-target" @click="openEmojisModal">
              <q-item-section avatar>
                <q-icon name="sentiment_satisfied_alt" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('settings.dashboardEmojis') }}</q-item-label>
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

            <q-item clickable class="touch-target" @click="showResetDbDialog = true">
              <q-item-section avatar>
                <q-icon name="restart_alt" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-negative">{{ $t('settings.resetDatabase') }}</q-item-label>
                <q-item-label caption>{{ $t('settings.resetDatabaseDesc') }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="negative" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- About Section -->
        <q-card class="finance-card q-mb-md">
          <q-list separator>
            <q-item clickable class="touch-target" @click="$router.push('/dashboard/help')">
              <q-item-section avatar>
                <q-icon name="help_outline" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t('help.title') }}</q-item-label>
                <q-item-label caption>{{ $t('help.subtitle') }}</q-item-label>
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

      </div>
    </div>

    <!-- User Profile Modal -->
    <q-dialog v-model="showUserProfileModal" persistent>
      <q-card style="min-width: 350px; border-radius: 16px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">{{ $t('settings.manageProfile') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetForm" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <!-- Avatar Section -->
          <div class="column items-center q-mb-lg">
            <q-avatar size="120px" color="dark" text-color="white" class="q-mb-md" style="cursor: pointer"
              @click="triggerFileInput">
              <img v-if="croppedAvatar || authStore.userProfile?.avatar"
                :src="croppedAvatar || authStore.userProfile?.avatar" />
              <q-icon v-else name="person" size="60px" />
              <div class="absolute-bottom-right q-pa-xs bg-dark rounded-borders">
                <q-icon name="camera_alt" size="18px" color="white" />
              </div>
            </q-avatar>
            <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileSelected" />
            <div v-if="showCropper" class="q-mt-md">
              <div class="crop-container q-mb-sm">
                <canvas ref="cropCanvas" class="crop-canvas"></canvas>
              </div>
              <div class="row q-gutter-sm justify-center">
                <q-btn-group flat>
                  <q-btn flat color="dark" :label="$t('common.cancel')" @click="cancelCrop" />
                  <q-btn unelevated color="dark" :label="$t('common.save')" @click="applyCrop" />
                </q-btn-group>
              </div>
            </div>
            <div v-else class="text-caption text-grey q-mt-sm">
              {{ $t('settings.tapToChangeAvatar') }}
            </div>
          </div>

          <!-- Name Input -->
          <q-input v-model="userName" :label="$t('settings.yourName')" outlined dense
            :placeholder="$t('settings.enterYourName')">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat :label="$t('common.cancel')" v-close-popup @click="resetForm" />
          <q-btn unelevated color="dark" :label="$t('common.save')" @click="saveUserProfile" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

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

    <!-- Change Password Dialog -->
    <q-dialog v-model="showChangePasswordDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 16px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">{{ $t('settings.changePassword') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetPasswordForm" />
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="currentPassword" :label="$t('settings.currentPassword')"
            :placeholder="$t('settings.enterCurrentPassword')" type="password" outlined autofocus>
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-input v-model="newPassword" :label="$t('settings.newPassword')"
            :placeholder="$t('settings.enterNewPassword')" type="password" outlined>
            <template v-slot:prepend>
              <q-icon name="key" />
            </template>
          </q-input>

          <q-input v-model="confirmNewPassword" :label="$t('settings.confirmNewPassword')"
            :placeholder="$t('settings.confirmPasswordChange')" type="password" outlined>
            <template v-slot:prepend>
              <q-icon name="key" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat :label="$t('common.cancel')" v-close-popup @click="resetPasswordForm" />
          <q-btn unelevated color="dark" :label="$t('common.save')" @click="changePassword"
            :loading="changingPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Reset Database Confirmation Dialog -->
    <q-dialog v-model="showResetDbDialog" persistent>
      <q-card style="min-width: 320px; max-width: 90vw; border-radius: 16px">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="warning" color="negative" size="28px" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">{{ $t('settings.resetDatabaseTitle') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup :disable="resettingDb" />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <p class="text-body2 text-grey-8">{{ $t('settings.resetDatabaseWarning') }}</p>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat :label="$t('common.cancel')" v-close-popup :disable="resettingDb" />
          <q-btn
            unelevated
            color="negative"
            :label="resettingDb ? $t('settings.resetting') : $t('common.yes')"
            :loading="resettingDb"
            @click="onResetDatabase"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dashboard Emojis Dialog -->
    <q-dialog v-model="showEmojisDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 16px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">{{ $t('settings.dashboardEmojis') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetEmojisForm" />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-caption text-grey q-mb-md">{{ $t('settings.dashboardEmojisDesc') }}</div>

          <!-- Negative Balance -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('settings.level1', { amount: emojisForm.negative.threshold }) }}
          </div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-8">
              <q-input v-model.number="emojisForm.negative.threshold" :label="$t('settings.thresholdAmount')"
                type="number" outlined dense :prefix="settings.currency" />
            </div>
            <div class="col-4">
              <q-input v-model="emojisForm.negative.emoji" :label="$t('settings.emoji')" outlined dense />
            </div>
          </div>

          <!-- Low Balance -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('settings.level2', {
            min: emojisForm.negative.threshold, max:
              emojisForm.low.threshold
          }) }}</div>
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-8">
              <q-input v-model.number="emojisForm.low.threshold" :label="$t('settings.thresholdAmount')" type="number"
                outlined dense :prefix="settings.currency" />
            </div>
            <div class="col-4">
              <q-input v-model="emojisForm.low.emoji" :label="$t('settings.emoji')" outlined dense />
            </div>
          </div>

          <!-- High Balance -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('settings.level3', { amount: emojisForm.low.threshold }) }}</div>
          <q-input v-model="emojisForm.high.emoji" :label="$t('settings.emoji')" outlined dense />

        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat :label="$t('common.cancel')" v-close-popup @click="resetEmojisForm" />
          <q-btn unelevated color="dark" :label="$t('common.save')" @click="saveEmojis" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'stores/settingsStore'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'
import { collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore'
import { firestore, auth } from 'boot/firebase'

const { t } = useI18n()
const settings = useSettingsStore()
const authStore = useAuthStore()

// Form refs
const fileInput = ref(null)
const cropCanvas = ref(null)
const showUserProfileModal = ref(false)
const userName = ref('')
const croppedAvatar = ref(null)
const saving = ref(false)

// Cropper state
const showCropper = ref(false)
const selectedFile = ref(null)
const imageElement = ref(null)

// Reset database
const showResetDbDialog = ref(false)
const resettingDb = ref(false)

// Dialog refs
const showPinDialog = ref(false)
const showChangePinDialog = ref(false)
const showRemovePinDialog = ref(false)
const newPin = ref('')
const currentPinInput = ref('')

// Password change refs
const showChangePasswordDialog = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const changingPassword = ref(false)

// Dashboard emojis config
const showEmojisDialog = ref(false)
const emojisForm = ref({
  negative: { emoji: '😭', threshold: 0 },
  low: { emoji: '😟', threshold: 500 },
  high: { emoji: '🤩' }
})

const selectedCurrency = ref(settings.currencyCode)
const selectedLang = ref(settings.language)
const selectedFont = ref(settings.fontFamily)
const selectedDateFormat = ref(settings.dateFormat)

const dateFormatOptions = [
  { label: 'DD MMM, YYYY', value: 'DD MMM, YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'DD MMMM YYYY', value: 'DD MMMM YYYY' }
]

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

// Initialize userName from store
onMounted(() => {
  if (authStore.userProfile) {
    userName.value = authStore.userProfile.name || ''
  }
})

// Watch for profile changes
watch(() => authStore.userProfile, (newProfile) => {
  if (newProfile) {
    userName.value = newProfile.name || ''
  }
}, { immediate: true })

function onCurrencyChange(code) {
  settings.setCurrency(currencySymbols[code] || code, code)
}

function onLanguageChange(lang) {
  settings.setLanguage(lang)
}

function onFontChange(font) {
  settings.setFont(font)
}

function onDateFormatChange(format) {
  settings.setDateFormat(format)
}

// --- User Profile Modal Functions ---

function openUserProfileModal() {
  userName.value = authStore.userProfile?.name || ''
  croppedAvatar.value = null
  showCropper.value = false
  showUserProfileModal.value = true
}

function resetForm() {
  userName.value = authStore.userProfile?.name || ''
  croppedAvatar.value = null
  selectedFile.value = null
  showCropper.value = false
  imageElement.value = null
}

function resetPasswordForm() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmNewPassword.value = ''
}

function openEmojisModal() {
  emojisForm.value = JSON.parse(JSON.stringify(settings.balanceEmojis))
  showEmojisDialog.value = true
}

function resetEmojisForm() {
  emojisForm.value = JSON.parse(JSON.stringify(settings.balanceEmojis))
  showEmojisDialog.value = false
}

function saveEmojis() {
  if (!emojisForm.value.negative.emoji || !emojisForm.value.low.emoji || !emojisForm.value.high.emoji) {
    Notify.create({ type: 'warning', message: t('settings.emojisEmpty') })
    return
  }
  if (emojisForm.value.negative.threshold >= emojisForm.value.low.threshold) {
    Notify.create({ type: 'warning', message: t('settings.thresholdError') })
    return
  }

  settings.setBalanceEmojis(JSON.parse(JSON.stringify(emojisForm.value)))
  Notify.create({ type: 'positive', message: t('settings.emojisUpdated') })
  showEmojisDialog.value = false
}

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    Notify.create({ type: 'warning', message: t('settings.imageTooLarge') })
    return
  }

  selectedFile.value = file
  showCropper.value = true

  // Load image for cropping
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imageElement.value = img
      initCropper(img)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function initCropper(img) {
  const canvas = cropCanvas.value
  const ctx = canvas.getContext('2d')

  // Set canvas size (max 300px)
  const maxSize = 300
  let width = img.width
  let height = img.height

  if (width > height) {
    if (width > maxSize) {
      height = (height * maxSize) / width
      width = maxSize
    }
  } else {
    if (height > maxSize) {
      width = (width * maxSize) / height
      height = maxSize
    }
  }

  canvas.width = width
  canvas.height = height

  // Draw image centered
  ctx.drawImage(img, 0, 0, width, height)
}

function cancelCrop() {
  showCropper.value = false
  selectedFile.value = null
  imageElement.value = null
}

function applyCrop() {
  if (!imageElement.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Create square crop from center (150px)
  const cropSize = 150
  const sourceImg = imageElement.value

  // Calculate crop dimensions
  let sx, sy, sSize
  if (sourceImg.width > sourceImg.height) {
    sSize = sourceImg.height
    sx = (sourceImg.width - sSize) / 2
    sy = 0
  } else {
    sSize = sourceImg.width
    sx = 0
    sy = (sourceImg.height - sSize) / 2
  }

  // Set output size
  canvas.width = cropSize
  canvas.height = cropSize

  // Draw cropped and scaled image
  ctx.drawImage(
    sourceImg,
    sx, sy, sSize, sSize,
    0, 0, cropSize, cropSize
  )

  // Convert to base64 with compression
  croppedAvatar.value = canvas.toDataURL('image/jpeg', 0.7)

  showCropper.value = false
  selectedFile.value = null
  imageElement.value = null
}

async function saveUserProfile() {
  saving.value = true

  try {
    // Update name
    if (userName.value !== authStore.userProfile?.name) {
      const nameResult = await authStore.updateUserName(userName.value)
      if (!nameResult.success) {
        Notify.create({ type: 'negative', message: t('settings.errorSavingName') })
        saving.value = false
        return
      }
    }

    // Update avatar if changed
    if (croppedAvatar.value && croppedAvatar.value !== authStore.userProfile?.avatar) {
      const avatarResult = await authStore.updateUserAvatar(croppedAvatar.value)
      if (!avatarResult.success) {
        Notify.create({ type: 'negative', message: t('settings.errorSavingAvatar') })
        saving.value = false
        return
      }
    }

    Notify.create({ type: 'positive', message: t('settings.profileSaved') })
    showUserProfileModal.value = false
    resetForm()
  } catch (error) {
    console.error('Error saving profile:', error)
    Notify.create({ type: 'negative', message: t('settings.errorSavingProfile') })
  } finally {
    saving.value = false
  }
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

async function onResetDatabase() {
  resettingDb.value = true
  try {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Not authenticated')

    const collections = ['transactions', 'accounts', 'categories', 'notes', 'marketLists']

    // Delete all documents from every subcollection
    await Promise.all(
      collections.map(async (col) => {
        const ref = collection(firestore, `users/${uid}/${col}`)
        const snap = await getDocs(ref)
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
      })
    )

    // Recreate default accounts
    const accountsRef = collection(firestore, `users/${uid}/accounts`)
    await Promise.all([
      addDoc(accountsRef, {
        name: 'Cash',
        type: 'Cash',
        balance: 0,
        icon: 'wallet',
        color: '#111111',
        createdAt: Date.now(),
      }),
      addDoc(accountsRef, {
        name: 'Bank',
        type: 'Bank',
        balance: 0,
        icon: 'account_balance',
        color: '#111111',
        createdAt: Date.now(),
      }),
    ])

    // Recreate default categories
    const categoriesRef = collection(firestore, `users/${uid}/categories`)
    const defaultCategories = [
      { type: 'expense', name: 'Groceries', icon: 'shopping_cart', color: '#f44336' },
      { type: 'expense', name: 'Restaurant', icon: 'restaurant', color: '#ff9800' },
      { type: 'expense', name: 'Transport', icon: 'directions_bus', color: '#2196f3' },
      { type: 'expense', name: 'Health', icon: 'local_hospital', color: '#e91e63' },
      { type: 'expense', name: 'Gifts', icon: 'card_giftcard', color: '#9c27b0' },
      { type: 'expense', name: 'Family', icon: 'family_restroom', color: '#4caf50' },
      { type: 'expense', name: 'Shopping', icon: 'shopping_bag', color: '#3f51b5' },
      { type: 'income', name: 'Salary', icon: 'attach_money', color: '#4caf50' },
    ]
    await Promise.all(
      defaultCategories.map((cat) =>
        addDoc(categoriesRef, {
          type: cat.type,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          budget: 0,
        })
      )
    )

    showResetDbDialog.value = false
    Notify.create({ type: 'positive', message: t('settings.resetDatabaseSuccess') })
  } catch (err) {
    console.error('Reset database error:', err)
    Notify.create({ type: 'negative', message: t('settings.resetDatabaseError') })
  } finally {
    resettingDb.value = false
  }
}

async function savePin() {
  if (newPin.value.length !== 4) {
    Notify.create({ type: 'warning', message: t('settings.pinMustBe4') })
    return
  }
  await settings.setPin(newPin.value)
  newPin.value = ''
  showPinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinSetSuccess') })
}

async function changePin() {
  if (!(await settings.verifyPin(currentPinInput.value))) {
    Notify.create({ type: 'negative', message: t('settings.wrongPin') })
    return
  }
  if (newPin.value.length !== 4) {
    Notify.create({ type: 'warning', message: t('settings.pinMustBe4') })
    return
  }
  await settings.setPin(newPin.value)
  newPin.value = ''
  currentPinInput.value = ''
  showChangePinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinSetSuccess') })
}

async function removePinConfirm() {
  if (!(await settings.verifyPin(currentPinInput.value))) {
    Notify.create({ type: 'negative', message: t('settings.wrongPin') })
    return
  }
  settings.removePin()
  currentPinInput.value = ''
  showRemovePinDialog.value = false
  Notify.create({ type: 'positive', message: t('settings.pinRemoved') })
}

async function changePassword() {
  // Validate password
  if (!currentPassword.value) {
    Notify.create({ type: 'warning', message: t('settings.enterCurrentPassword') })
    return
  }

  if (!newPassword.value || newPassword.value.length < 6) {
    Notify.create({ type: 'warning', message: t('settings.passwordMinChars') })
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    Notify.create({ type: 'warning', message: t('settings.passwordNotMatch') })
    return
  }

  changingPassword.value = true

  try {
    const result = await authStore.changePassword(currentPassword.value, newPassword.value)

    if (result.success) {
      Notify.create({ type: 'positive', message: t('settings.passwordChanged') })
      showChangePasswordDialog.value = false
      resetPasswordForm()
    } else {
      // Handle specific Firebase auth errors
      if (result.error && result.error.includes('wrong-password')) {
        Notify.create({ type: 'negative', message: t('settings.wrongPassword') })
      } else if (result.error && result.error.includes('requires-recent-authentication')) {
        Notify.create({ type: 'negative', message: t('settings.wrongPassword') })
      } else {
        Notify.create({ type: 'negative', message: result.error || t('common.error') })
      }
    }
  } catch (error) {
    console.error('Password change error:', error)
    Notify.create({ type: 'negative', message: t('common.error') + error.message })
  } finally {
    changingPassword.value = false
  }
}

</script>

<style scoped>
.crop-container {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.crop-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.touch-target {
  min-height: 56px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
  margin-left: 4px;
}
</style>
