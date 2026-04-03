import api from '@/api/axios'

const eventService = {
  async getEvents() {
    const res = await api.get('/events')
    return res.data
  },

  async createEvent(payload) {
    const res = await api.post('/events', payload)
    return res.data
  },
}

export default eventService