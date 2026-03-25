import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSubscription as useSubscriptionHook } from '@/hooks/useSubscription';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
    const { isActive, subscription, loading, refetch } = useSubscriptionHook();
    const location = useLocation();

    // Subscription is fetched once on mount via useSubscription hook.
    // Relies on webhook and explicit refresh for updates to avoid spamming the API.

    return (
        <SubscriptionContext.Provider value={{ isActive, subscription, loading, refreshSubscription: refetch }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscriptionContext = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
    }
    return context;
};
