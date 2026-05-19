import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Dark, date } from 'quasar'
import i18n from 'src/i18n'

// Hash a PIN string using SHA-256 via the Web Crypto API.
// Returns a lowercase hex string (64 chars).
async function hashPin(rawPin) {
  const encoder = new TextEncoder()
  const data = encoder.encode(rawPin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const useSettingsStore = defineStore('settings', () => {
  const currency = ref('৳')
  const currencyCode = ref('BDT')
  const language = ref('bn')
  const fontFamily = ref('Tiro Bangla')
  const dateFormat = ref('DD MMM, YYYY')
  const timezone = ref('Asia/Dhaka')
  const darkMode = ref(false)
  const appLock = ref(false)
  // PIN is stored internally as a SHA-256 hash and never exposed in the return object.
  const _pinHash = ref('')
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
        if (s.timezone) timezone.value = s.timezone
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
    // Load PIN separately – stored as SHA-256 hash since v2.
    // If the stored value is not a 64-char hex string it is a legacy plaintext PIN;
    // migrate it transparently by hashing and re-saving.
    const savedPin = localStorage.getItem('finance_pin')
    if (savedPin) {
      const isAlreadyHashed = /^[0-9a-f]{64}$/.test(savedPin)
      if (isAlreadyHashed) {
        _pinHash.value = savedPin
        appLock.value = true
      } else {
        // Migrate legacy plaintext PIN → hash
        hashPin(savedPin).then((hashed) => {
          _pinHash.value = hashed
          appLock.value = true
          localStorage.setItem('finance_pin', hashed)
        })
      }
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
        timezone: timezone.value,
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

  function setTimezone(tz) {
    timezone.value = tz
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

    // Parse the date string and convert to the selected timezone
    let dateObj = new Date(dateString)
    if (isNaN(dateObj)) return dateString

    // Get the timezone offset for the selected timezone
    // We need to convert the UTC date to the user's selected timezone
    const targetTimezone = timezone.value

    // Create a formatter to get the date parts in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    // Parse the formatted date parts and create a new date object
    const parts = formatter.formatToParts(dateObj)
    const getPart = (type) => parts.find((p) => p.type === type)?.value || '0'

    // Create a new date using the timezone-adjusted values
    // This effectively shifts the date to display in the selected timezone
    const tzYear = parseInt(getPart('year'))
    const tzMonth = parseInt(getPart('month')) - 1 // Months are 0-indexed
    const tzDay = parseInt(getPart('day'))
    const tzHour = parseInt(getPart('hour'))
    const tzMinute = parseInt(getPart('minute'))
    const tzSecond = parseInt(getPart('second'))

    dateObj = new Date(Date.UTC(tzYear, tzMonth, tzDay, tzHour, tzMinute, tzSecond))

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

  async function setPin(newPin) {
    const hashed = await hashPin(newPin)
    _pinHash.value = hashed
    appLock.value = true
    localStorage.setItem('finance_pin', hashed)
  }

  function removePin() {
    _pinHash.value = ''
    appLock.value = false
    isAuthenticated.value = false
    localStorage.removeItem('finance_pin')
  }

  async function verifyPin(input) {
    const hashed = await hashPin(input)
    return hashed === _pinHash.value
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
    timezone,
    darkMode,
    appLock,
    // NOTE: raw PIN / hash is intentionally NOT returned here to prevent
    // accidental exposure via Vue DevTools or component templates.
    isAuthenticated,
    balanceEmojis,
    toggleDarkMode,
    setDarkMode,
    setCurrency,
    setLanguage,
    setFont,
    setDateFormat,
    setTimezone,
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
