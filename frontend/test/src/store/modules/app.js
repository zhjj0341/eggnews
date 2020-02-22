import Cookies from 'js-cookie'

const app = {
  state: {
    language: Cookies.get('language') || 'zh',
    isConnected: true
  },
  getters: {
    getLanguage: state => state.language,
    getIsConnected: state => state.isConnected
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_ISCONNCETED: (state, isConnected) => {
      state.isConnected = isConnected
    }
  },
  actions: {
    setLanguage ({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
