<template>
    <q-page class="flex flex-center">
        <div class="column items-center q-gutter-md text-center q-pa-lg" style="max-width: 320px">
            <!-- Logo -->
            <q-avatar size="80px" color="dark" text-color="white" icon="account_balance_wallet" />

            <div>
                <div class="text-h5 text-weight-bold">{{ $t('splash.title') }}</div>
                <div class="text-caption text-grey">{{ $t('splash.subtitle') }}</div>
            </div>

            <!-- Dark mode -->
            <div class="row items-center q-gutter-sm">
                <q-icon name="dark_mode" size="20px" />
                <span class="text-body2">{{ $t('common.darkMode') }}</span>
                <q-toggle v-model="isDark" color="dark" />
            </div>

            <!-- PIN Lock -->
            <template v-if="settings.appLock">
                <div class="text-caption text-grey q-mt-sm">
                    <q-icon name="lock" size="18px" class="q-mr-xs" />
                    {{ $t('splash.enterPin') }}
                </div>

                <div class="row justify-center q-gutter-sm q-mt-sm">
                    <q-input v-for="i in 4" :key="i" :ref="el => { if (el) pinRefs[i - 1] = el }"
                        v-model="pinDigits[i - 1]" outlined dense type="password" maxlength="1"
                        input-class="text-center text-h6" style="width: 52px; height: 52px;"
                        @update:model-value="onDigitInput(i - 1)" @keydown.backspace="onBackspace(i - 1)" />
                </div>

                <div v-if="pinError" class="text-negative text-caption q-mt-xs">
                    {{ $t('settings.wrongPin') }}
                </div>

                <q-btn :label="$t('splash.unlock')" color="dark" unelevated rounded class="full-width q-mt-md" no-caps
                    @click="unlockApp" :disable="pinDigits.join('').length !== 4" />
            </template>

            <!-- No PIN -->
            <q-btn v-else :label="$t('splash.start')" color="dark" unelevated rounded class="full-width" no-caps
                @click="goHome" />
        </div>
    </q-page>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'stores/settingsStore'
import { useQuasar } from 'quasar'

useI18n()
const router = useRouter()
const settings = useSettingsStore()
const $q = useQuasar()

const isDark = ref($q.dark.isActive)
const pinDigits = ref(['', '', '', ''])
const pinRefs = ref([])
const pinError = ref(false)

watch(isDark, (val) => {
    $q.dark.set(val)
})

function onDigitInput(index) {
    pinError.value = false
    if (pinDigits.value[index] && index < 3) {
        nextTick(() => {
            pinRefs.value[index + 1]?.focus()
        })
    }
    // Auto-submit when all 4 digits entered
    if (pinDigits.value.join('').length === 4) {
        nextTick(() => unlockApp())
    }
}

function onBackspace(index) {
    if (!pinDigits.value[index] && index > 0) {
        nextTick(() => {
            pinRefs.value[index - 1]?.focus()
        })
    }
}

function unlockApp() {
    const enteredPin = pinDigits.value.join('')
    if (settings.verifyPin(enteredPin)) {
        settings.authenticate()
        router.push('/dashboard')
    } else {
        pinError.value = true
        pinDigits.value = ['', '', '', '']
        nextTick(() => {
            pinRefs.value[0]?.focus()
        })
    }
}

function goHome() {
    settings.authenticate()
    router.push('/dashboard')
}
</script>
