import en from './en'
import zh from './zh'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)

const language = {
  en,
  zh
}
export const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh', // set locale
  messages: language // set locale messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

i18n.missing = (locale, key, vm) => {
  // handle translation missing
  return key
}

// export default i18n

// export function createI18n() {
//   return new VueI18n({
//     locale: 'zh', // set locale
//     fallbackLocale: 'zh',
//     messages: language // set locale messages
//   })
// }
