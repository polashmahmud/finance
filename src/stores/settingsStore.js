import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Dark } from 'quasar'

export const useSettingsStore = defineStore('settings', () => {
  const currency = ref('৳')
  const currencyCode = ref('BDT')
  const language = ref('en')
  const darkMode = ref(false)
  const appLock = ref(false)
  const pin = ref('')
  const isAuthenticated = ref(false)

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    Dark.set(darkMode.value)
  }

  function setDarkMode(val) {
    darkMode.value = val
    Dark.set(val)
  }

  function setCurrency(symbol, code) {
    currency.value = symbol
    currencyCode.value = code
  }

  function setLanguage(lang) {
    language.value = lang
  }

  function setPin(newPin) {
    pin.value = newPin
    appLock.value = true
  }

  function authenticate() {
    isAuthenticated.value = true
  }

  function lock() {
    isAuthenticated.value = false
  }

  return {
    currency,
    currencyCode,
    language,
    darkMode,
    appLock,
    pin,
    isAuthenticated,
    toggleDarkMode,
    setDarkMode,
    setCurrency,
    setLanguage,
    setPin,
    authenticate,
    lock,
  }
})
