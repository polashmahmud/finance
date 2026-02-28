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

  // Balance Emojis Configuration
  const balanceEmojis = ref({
    negative: { emoji: '😭', threshold: 0 },
    low: { emoji: '😟', threshold: 500 },
    high: { emoji: '🤩' },
  })

  // Map English to Bengali numerals
  const engToBnNumerals = {
    0: '০',
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯',
  }

  function toBengaliNumerals(str) {
    if (!str) return str
    return str.toString().replace(/\d/g, (match) => engToBnNumerals[match] || match)
  }

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
        if (s.balanceEmojis) {
          balanceEmojis.value = s.balanceEmojis
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
        balanceEmojis: balanceEmojis.value,
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

  function setBalanceEmojis(newEmojis) {
    balanceEmojis.value = newEmojis
    saveSettings()
  }

  function formatNumber(value) {
    if (value === null || value === undefined) return ''
    const num = Number(value)
    if (isNaN(num)) return value

    // Enforce locale formatting with appropriate thousands separator
    const localeStr = num.toLocaleString('en-US')

    // Automatically convert to Bengali numerals if language is Bengali
    if (language.value === 'bn') {
      return toBengaliNumerals(localeStr)
    }
    return localeStr
  }

  function formatDate(dateString, overrideFormat = null) {
    if (!dateString) return ''
    const dateObj = new Date(dateString)
    if (isNaN(dateObj)) return dateString

    // Bengali Date Names
    const bnOptions = {
      days: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
      daysShort: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'],
      months: [
        'জানুয়ারি',
        'ফেব্রুয়ারি',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুলাই',
        'আগস্ট',
        'সেপ্টেম্বর',
        'অক্টোবর',
        'নভেম্বর',
        'ডিসেম্বর',
      ],
      monthsShort: [
        'জানু',
        'ফেব',
        'মার্চ',
        'এপ্রিল',
        'মে',
        'জুন',
        'জুল',
        'আগ',
        'সেপ্ট',
        'অক্টো',
        'নভে',
        'ডিসে',
      ],
    }

    let formatted = ''

    if (language.value === 'bn') {
      formatted = date.formatDate(dateObj, overrideFormat || dateFormat.value, bnOptions)
      return toBengaliNumerals(formatted)
    }

    formatted = date.formatDate(dateObj, overrideFormat || dateFormat.value)
    return formatted
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
    balanceEmojis,
    toggleDarkMode,
    setDarkMode,
    setCurrency,
    setLanguage,
    setFont,
    setDateFormat,
    setBalanceEmojis,
    formatDate,
    formatNumber,
    toBengaliNumerals,
    setPin,
    removePin,
    verifyPin,
    authenticate,
    lock,
  }
})
