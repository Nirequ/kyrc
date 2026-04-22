import { defineStore } from 'pinia'
import { loginRequest, registerRequest, updateGeolocationRequest } from '../services/authService'

type AuthPayload = {
  token: string
  user: Record<string, any>
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as Record<string, any> | null,
    loading: false,
    error: '',
  }),
  getters: {
    isAuthorized: (state) => Boolean(state.token),
  },
  actions: {
    initFromStorage() {
      this.token = localStorage.getItem('token') || ''
      const cachedUser = localStorage.getItem('user')
      if (!cachedUser) return
      try {
        this.user = JSON.parse(cachedUser)
      } catch {
        this.user = null
      }
    },
    setAuthState(payload: AuthPayload) {
      this.token = payload.token
      this.user = payload.user
      localStorage.setItem('token', payload.token)
      localStorage.setItem('user', JSON.stringify(payload.user))
    },
    async login(credentials: { login: string; password: string }) {
      this.loading = true
      this.error = ''
      try {
        const payload = await loginRequest(credentials)
        this.setAuthState(payload)
        return true
      } catch (error: any) {
        this.error = `Ошибка входа: ${error.message}`
        return false
      } finally {
        this.loading = false
      }
    },
    async register(data: { login: string; password: string; firstName: string }) {
      this.loading = true
      this.error = ''
      try {
        const payload = await registerRequest(data)
        this.setAuthState(payload)
        return true
      } catch (error: any) {
        this.error = `Ошибка регистрации: ${error.message}`
        return false
      } finally {
        this.loading = false
      }
    },
    async saveGeolocation(payload: { lat: number | null; lng: number | null; address: string }) {
      if (!this.token || !this.user) return false
      try {
        const response = await updateGeolocationRequest(this.token, payload)
        this.user = {
          ...this.user,
          geolocation: response.geolocation || payload,
        }
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch {
        return false
      }
    },
    logout() {
      this.token = ''
      this.user = null
      this.error = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('selected_address')
      localStorage.removeItem('selected_geolocation')
    },
  },
})
