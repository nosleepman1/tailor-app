import api from '@/api/axios'

const dashboardService = {
  async getStats() {
    const res = await api.get('/dashboard')
    return res.data
  },
}

export default dashboardService