import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Dark, date } from 'quasar'
import i18n from 'src/i18n'

export const useSettingsStore = defineStore('settings', () => {
  const currency = ref('৳')
  const currencyCode = ref('BDT')
  const language = ref('bn')
  const fontFamily = ref('Tiro Bangla')
  const dateFormat = ref('DD MMM, YYYY')
  const darkMode = ref(false)
  const appLock = ref(false)
  const pin = ref('')
  const isAuthenticated = ref(false)

  // Load all settings from localStorage on init
  function loadSettings() {
    const saved = localStorage.getItem('finance_settings')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        if (s.currency) currency.value = s.currency
        if (s.currencyCode) currencyCode.value = s.currencyCode
        if (s.language) language.value = s.language
        if (s.fontFamily) fontFamily.value = s.fontFamily
        if (s.dateFormat) dateFormat.value = s.dateFormat
        if (s.darkMode !== undefined) {
          darkMode.value = s.darkMode
          Dark.set(s.darkMode)
        }
        if (s.language) i18n.global.locale.value = s.language
      } catch {
        /* ignore parse errors */
      }
    }
    // Load PIN separately
    const savedPin = localStorage.getItem('finance_pin')
    if (savedPin) {
      pin.value = savedPin
      appLock.value = true
    }
  }

  function saveSettings() {
    localStorage.setItem(
      'finance_settings',
      JSON.stringify({
        currency: currency.value,
        currencyCode: currencyCode.value,
        language: language.value,
        fontFamily: fontFamily.value,
        dateFormat: dateFormat.value,
        darkMode: darkMode.value,
      }),
    )
  }

  loadSettings()

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    Dark.set(darkMode.value)
    saveSettings()
  }

  function setDarkMode(val) {
    darkMode.value = val
    Dark.set(val)
    saveSettings()
  }

  function setCurrency(symbol, code) {
    currency.value = symbol
    currencyCode.value = code
    saveSettings()
  }

  function setLanguage(lang) {
    language.value = lang
    i18n.global.locale.value = lang
    saveSettings()
  }

  function setFont(font) {
    fontFamily.value = font
    saveSettings()
  }

  function setDateFormat(format) {
    dateFormat.value = format
    saveSettings()
  }

  function formatDate(dateString) {
    if (!dateString) return ''
    const dateObj = new Date(dateString)
    if (isNaN(dateObj)) return dateString
    return date.formatDate(dateObj, dateFormat.value)
  }

  function setPin(newPin) {
    pin.value = newPin
    appLock.value = true
    localStorage.setItem('finance_pin', newPin)
  }

  function removePin() {
    pin.value = ''
    appLock.value = false
    isAuthenticated.value = false
    localStorage.removeItem('finance_pin')
  }

  function verifyPin(input) {
    return input === pin.value
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
    fontFamily,
    dateFormat,
    darkMode,
    appLock,
    pin,
    isAuthenticated,
    toggleDarkMode,
    setDarkMode,
    setCurrency,
    setLanguage,
    setFont,
    setDateFormat,
    formatDate,
    setPin,
    removePin,
    verifyPin,
    authenticate,
    lock,
  }
})
