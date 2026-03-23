import { useState, useEffect, useCallback } from 'react'
import clientService from '@/services/clientService'
import { offlineQueue } from '@/utils/offlineQueue'

export function useClients() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await clientService.getClients()
      const raw = res?.data ?? res
      setData(Array.isArray(raw) ? raw : raw?.data ?? [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  async function createClient(payload) {
    if (!navigator.onLine) {
      offlineQueue.push({ type: 'createClient', payload })
      const tempClient = { ...payload, id: `offline_${Date.now()}`, _offline: true }
      setData(prev => [tempClient, ...prev])
      return tempClient
    }
    const res = await clientService.createClient(payload)
    const newClient = res?.data ?? res
    setData(prev => [newClient, ...prev])
    return newClient
  }

  async function updateClient(id, payload) {
    if (!navigator.onLine) {
      offlineQueue.push({ type: 'updateClient', payload: { id, ...payload } })
      setData(prev => prev.map(c => c.id === id ? { ...c, ...payload } : c))
      return
    }
    const res = await clientService.updateClient(id, payload)
    const updated = res?.data ?? res
    setData(prev => prev.map(c => c.id === id ? updated : c))
    return updated
  }

  async function updateClientStatus(id, payload) {
    if (!navigator.onLine) {
      setData(prev => prev.map(c => c.id === id ? { ...c, ...payload } : c))
      return
    }
    const res = await clientService.updateClientStatus(id, payload)
    const raw = res?.data ?? res
    const updated = raw?.data ?? raw
    setData(prev => prev.map(c => c.id === id ? (updated || { ...c, ...payload }) : c))
    return updated
  }

  async function deleteClient(id) {
    if (!navigator.onLine) {
      offlineQueue.push({ type: 'deleteClient', payload: { id } })
      setData(prev => prev.filter(c => c.id !== id))
      return
    }
    await clientService.deleteClient(id)
    setData(prev => prev.filter(c => c.id !== id))
  }

  return { data, loading, error, refetch: fetchClients, createClient, updateClient, updateClientStatus, deleteClient }
}
