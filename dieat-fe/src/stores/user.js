import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || ''
  }),

  actions: {
    setUser(userData) {
      this.user = userData
    },

    setAccessToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },

    logout() {
      this.user = null
      this.accessToken = ''
      localStorage.removeItem('accessToken')
    }
  },

  getters: {
    isLogin: (state) => !!state.accessToken
  }
})
