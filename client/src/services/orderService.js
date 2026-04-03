import api from '@/api/axios'

const orderService = {
  async getOrders() {
    const res = await api.get('/commandes')
    return res.data
  },
}

export default orderService