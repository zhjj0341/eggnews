import Vue from 'vue'
// 兼容低版本浏览器(caniuse)，需要引入polyfill
import 'babel-polyfill'
import '@/bootstrap' // 操作数组依赖的封装
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/importElementUI' // 按需引入elementui
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/permission' // 权限
import { i18n } from '@/lang'
import UtilsPlugin from '@/utils/index'

Vue.use(UtilsPlugin)
Vue.config.productionTip = false

export default new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App }
})
