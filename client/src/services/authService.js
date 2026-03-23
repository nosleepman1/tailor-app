import api from '@/api/axios'

const authService = {
  async login(email, password) {
    const res = await api.post('/login', { email, password })
    return res.data // { token, user }
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch (_) {
      /* ignore */
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  async getProfile() {
    const res = await api.get('/me')
    return res.data
  },
}

export default authService
