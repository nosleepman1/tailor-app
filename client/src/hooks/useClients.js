import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import clientService from '@/services/clientService'
import { offlineQueue } from '@/utils/offlineQueue'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await clientService.getClients()
      return res?.data ?? res
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useClient(id) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      const res = await clientService.getClient(id)
      return res?.data ?? res
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      if (!navigator.onLine) {
        offlineQueue.push({ type: 'createClient', payload })
        const tempClient = { ...payload, id: `offline_${Date.now()}`, _offline: true }
        // Optimistically update cache
        queryClient.setQueryData(['clients'], (old) => [tempClient, ...(old || [])])
        return tempClient
      }
      return await clientService.createClient(payload)
    },
    onSuccess: (data) => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['clients'] })
      }
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      if (!navigator.onLine) {
        offlineQueue.push({ type: 'updateClient', payload: { id, ...payload } })
        // Optimistically update cache
        queryClient.setQueryData(['clients'], (old) =>
          old?.map(c => c.id === id ? { ...c, ...payload } : c) || []
        )
        return
      }
      return await clientService.updateClient(id, payload)
    },
    onSuccess: () => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['clients'] })
      }
    },
  })
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      if (!navigator.onLine) {
        // Optimistically update cache
        queryClient.setQueryData(['clients'], (old) =>
          old?.map(c => c.id === id ? { ...c, ...payload } : c) || []
        )
        return
      }
      return await clientService.updateClientStatus(id, payload)
    },
    onSuccess: () => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['clients'] })
      }
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      if (!navigator.onLine) {
        offlineQueue.push({ type: 'deleteClient', payload: { id } })
        // Optimistically update cache
        queryClient.setQueryData(['clients'], (old) =>
          old?.filter(c => c.id !== id) || []
        )
        return
      }
      return await clientService.deleteClient(id)
    },
    onSuccess: () => {
      if (navigator.onLine) {
        queryClient.invalidateQueries({ queryKey: ['clients'] })
      }
    },
  })
}
