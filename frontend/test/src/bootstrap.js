import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { i18n } from '@/lang'
// Load method categories.
/* 多语言 */
import ElementLocale from 'element-ui/lib/locale'
Vue.use(ElementUI, { size: 'mini' })

ElementLocale.i18n((key, value) => i18n.t(key, value))
