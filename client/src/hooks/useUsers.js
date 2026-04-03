import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userService from '@/services/userService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await userService.getUsers()
      return res?.data ?? res
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useUser(id) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const res = await userService.getUser(id)
      return res?.data ?? res
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => userService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useToggleUserActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, is_active }) => userService.toggleActive(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useTailors() {
  return useQuery({
    queryKey: ['tailors'],
    queryFn: async () => {
      const res = await userService.getTailors()
      return res?.data ?? res
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateTailor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.createTailor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tailors'] })
    },
  })
}
