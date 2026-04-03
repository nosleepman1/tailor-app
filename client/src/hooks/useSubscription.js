import { useQuery } from '@tanstack/react-query';
import { getCurrentSubscription } from '@/services/subscriptionService';
import { useAuthStore } from '@/store/authStore';

export function useSubscription() {
    const isAuthenticated = !!useAuthStore(state => state.token);

    const { data: subscription, isLoading: loading, refetch } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await getCurrentSubscription();
            return data.subscription;
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    const isActive = subscription?.status === 'active' && new Date(subscription?.expires_at) > new Date();

    return { isActive, subscription, loading, refetch };
}
