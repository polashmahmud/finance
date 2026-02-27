import { createI18n } from 'vue-i18n'
import en from './en.js'
import bn from './bn.js'

const i18n = createI18n({
  legacy: false,
  locale: 'bn',
  fallbackLocale: 'en',
  messages: {
    en,
    bn,
  },
})

export default i18n
