import api from '@/api/axios'

const userService = {
  async getUsers(params = {}) {
    const res = await api.get('/users', { params })
    return res.data
  },

  async getUser(id) {
    const res = await api.get(`/users/${id}`)
    return res.data
  },

  async createUser(payload) {
    const res = await api.post('/users', payload)
    return res.data
  },

  async updateUser(id, payload) {
    const res = await api.put(`/users/${id}`, payload)
    return res.data
  },

  async deleteUser(id) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  async toggleActive(id, is_active) {
    const res = await api.put(`/users/${id}`, { is_active })
    return res.data
  },
}

export default userService
