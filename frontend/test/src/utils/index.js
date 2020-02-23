import utils from '@/utils/global'
const plugin = {
  install (Vue) {
    Vue.prototype.utils = utils// 常用的方法
  }
  // $rns: RNS
}
export default plugin
export const install = plugin.install
