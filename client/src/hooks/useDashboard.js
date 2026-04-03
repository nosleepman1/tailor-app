import { useQuery } from '@tanstack/react-query'
import dashboardService from '@/services/dashboardService'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardService.getStats()
      return res.stats
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}