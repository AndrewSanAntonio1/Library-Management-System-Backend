import api from './api'

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async logout(refreshToken) {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(email, resetToken, newPassword) {
    const response = await api.post('/auth/reset-password', {
      email,
      resetToken,
      newPassword,
    })
    return response.data
  },

  async getProfile(email) {
    const response = await api.get(`/auth/profile?email=${email}`)
    return response.data
  },
}
