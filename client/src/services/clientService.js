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

  async updateClientStatus(id, { is_paid, livre }) {
    const res = await api.patch(`/clients/${id}/status`, { is_paid, livre })
    return res.data
  },
}

const MESURE_KEYS = ['epaule', 'taille', 'poitrine', 'hanche', 'manche', 'cou', 'cuisse', 'bras', 'pantalon', 'biceps', 'fesse']
const MESURE_ALIAS = { hanches: 'hanche', manches: 'manche', fesses: 'fesse' }

function toFormData(payload) {
  const fd = new FormData()
  const { mesures, model_image, tissus_image, ...rest } = payload

  Object.entries(rest).forEach(([key, val]) => {
    if (val !== undefined && val !== null && key !== 'mesures') {
      if (typeof val === 'boolean') fd.append(key, val ? '1' : '0')
      else fd.append(key, String(val))
    }
  })

  if (mesures && typeof mesures === 'object') {
    Object.entries(mesures).forEach(([key, val]) => {
      const k = MESURE_ALIAS[key] || key
      if (MESURE_KEYS.includes(k) && val !== '' && val !== undefined && val !== null) {
        fd.append(k, val)
      }
    })
  }

  if (model_image instanceof File) fd.append('model_image', model_image)
  if (tissus_image instanceof File) fd.append('tissus_image', tissus_image)

  return fd
}

export default clientService
