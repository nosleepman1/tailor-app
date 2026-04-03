import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import eventService from '@/services/eventService'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}