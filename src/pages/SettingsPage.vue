<template>
  <q-page class="q-pa-md">
    <div class="q-mb-md">
      <div class="text-h5 text-weight-bold">{{ $t('settings.title') }}</div>
    </div>

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

    <!-- About Section -->
    <q-card class="finance-card q-mb-md">
      <q-list separator>
        <q-item clickable class="touch-target" @click="$router.push('/help')">
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
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'stores/settingsStore'
import { useAuthStore } from 'stores/authStore'
import { Notify } from 'quasar'

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

// Dialog refs
const showPinDialog = ref(false)
const showChangePinDialog = ref(false)
const showRemovePinDialog = ref(false)
const newPin = ref('')
const currentPinInput = ref('')

// Select refs
const selectedCurrency = ref(settings.currencyCode)
const selectedLang = ref(settings.language)
const selectedFont = ref(settings.fontFamily)

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
