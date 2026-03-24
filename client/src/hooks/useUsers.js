import { useState, useEffect, useCallback } from 'react'
import userService from '@/services/userService'

export function useUsers() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await userService.getUsers()
      const raw = res?.data ?? res
      setData(Array.isArray(raw) ? raw : raw?.data ?? [])
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function createUser(payload) {
    const res = await userService.createUser(payload)
    const newUser = res?.data ?? res?.user ?? res
    setData(prev => [newUser, ...prev])
    return newUser
  }

  async function updateUser(id, payload) {
    const res = await userService.updateUser(id, payload)
    const updated = res?.data ?? res
    setData(prev => prev.map(u => u.id === id ? updated : u))
    return updated
  }

  async function deleteUser(id) {
    await userService.deleteUser(id)
    setData(prev => prev.filter(u => u.id !== id))
  }

  async function toggleActive(id, is_active) {
    const res = await userService.toggleActive(id, is_active)
    const updated = res?.data ?? res
    setData(prev => prev.map(u => u.id === id ? updated : u))
    return updated
  }

  return { data, loading, error, refetch: fetchUsers, createUser, updateUser, deleteUser, toggleActive }
}
