import api from '@/api/axios'

const clientService = {
  async getClients(params = {}) {
    const res = await api.get('/clients', { params })
    return res.data
  },

  async getClient(id) {
    const res = await api.get(`/clients/${id}`)
    return res.data
  },

  async createClient(payload) {
    const formData = toFormData(payload)
    const res = await api.post('/clients', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async updateClient(id, payload) {
    const formData = toFormData(payload)
    formData.append('_method', 'PUT')
    const res = await api.post(`/clients/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async deleteClient(id) {
    const res = await api.delete(`/clients/${id}`)
    return res.data
  },
}

function toFormData(payload) {
  const fd = new FormData()
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      if (val instanceof File) fd.append(key, val)
      else if (typeof val === 'object') fd.append(key, JSON.stringify(val))
      else fd.append(key, val)
    }
  })
  return fd
}

export default clientService
