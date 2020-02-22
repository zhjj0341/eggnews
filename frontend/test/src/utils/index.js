import { RNS } from '@/router/router_names'
import utils from '@/utils/global'
const plugin = {
  install (Vue) {
    Vue.prototype.$rns = RNS// 路由的名字
    // Vue.rns = RNS

    Vue.prototype.utils = utils// 常用的方法
  }
  // $rns: RNS
}
export default plugin
export const install = plugin.install
