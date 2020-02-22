/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import getters from './getters'
import app from './modules/app'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    app,
  }
})

if (module.hot) {
  // 使 actions 和 mutations 成为可热重载模块
  module.hot.accept(['./modules/app'], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 .default
    const app = require('./modules/app').default
    // 加载新模块
    store.hotUpdate({
      modules: {
        app
      }
    })
  })
}
