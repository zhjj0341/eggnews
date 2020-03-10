import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { _pageTransfer } from '@/store/libs/tools'

const user = {
  state: {
    token: getToken(),
    info: localStorage.getItem('userinfo') && JSON.parse(localStorage.getItem('userinfo')),
    isInit: false
  },

  getters: {
    isInit: (state) => {
      return state.isInit
    }
  },

  mutations: {
    SET_TOKEN: (state, { handleTransfer = true, data }) => {
      let { token, time } = data || {}
      if (token) {
        setToken({ token, time })
      } else {
        removeToken()
      }
      token = token || ''
      // if (handleTransfer) {
      //   _pageTransfer({ type: 'SET_TOKEN', data: token ? { token, time } : { token } })
      // } else if (Boolean(token) !== Boolean(state.token)) { // 当是页面收到通知,并且两者其中一个为空的情况下
      //   location.href = '/'
      // }
      state.token = token // 这个需要放在上面判断的最后,以防当前页面自己收到自己的通知，当前窗口不刷新，会由401状态统一弹一个提示窗口出来,
    },
    SET_INFO: (state, info) => {
      localStorage.setItem('userinfo', JSON.stringify(info))
      state.info = info
    }
  },

  actions: {
    // 清除用户的信息
    clearUserInfo ({ commit }) {
      commit('SET_TOKEN', { data: { token: '' } })
      localStorage.removeItem('pm')
      commit('SET_INIT', false)
      return false
    },
    // 登录
    Login ({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userInfo).then(({ err, res }) => {
          if (!err) {
            // commit('SET_PERMISSION', res.menus)
            if (res.token) {
              // 如果 header 中存在 token，现在只从response更新token
              commit('SET_TOKEN', { data: { token: res.token } })
            }
            commit('SET_INFO', { username: String(userInfo.account).toUpperCase() })
            resolve()
          } else {
            reject(err)
          }
        })
      })
    }
  }
}

export default user
