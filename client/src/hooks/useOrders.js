import { useQuery } from '@tanstack/react-query'
import orderService from '@/services/orderService'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderService.getOrders()
      return res.data || res
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}