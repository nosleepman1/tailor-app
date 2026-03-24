import { useState, useEffect, useCallback } from 'react';
import { getCurrentSubscription } from '@/services/subscriptionService';
import { useAuthStore } from '@/store/authStore';

export function useSubscription() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!useAuthStore(state => state.token);

    const fetchSubscription = useCallback(async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data } = await getCurrentSubscription();
            setSubscription(data.subscription);
        } catch (error) {
            console.error('Failed to fetch subscription', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const isActive = subscription?.status === 'active' && new Date(subscription?.expires_at) > new Date();

    return { isActive, subscription, loading, refetch: fetchSubscription };
}
