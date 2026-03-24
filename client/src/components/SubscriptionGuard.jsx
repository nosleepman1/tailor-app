import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionContext } from '@/context/SubscriptionContext';
import Loader from '@/components/Loader';

// Component mapping for lazy loading, handles admin check, auth check & subscription guard
export default function SubscriptionGuard({ children, adminOnly = false }) {
    const user = useAuthStore(state => state.user);
    const token = useAuthStore(state => state.token);
    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';
    const { isActive, loading } = useSubscriptionContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!isAdmin) {
        // Wait for subscription status check before rendering content
        if (loading) {
            return <Loader fullscreen />;
        }
        
        // Block pages requiring a subscription if inactive
        if (!isActive) {
            return <Navigate to="/subscription?expired=true" replace />;
        }
    }

    return children;
}
