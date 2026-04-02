import { useState, useEffect } from 'react';
import { pushService } from '../services/pushService';
import { useToast } from '@/contexts/ToastContext';

export function usePushNotifications() {
    const toast = useToast();
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
            checkSubscription();
        } else {
            setLoading(false);
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const sub = await pushService.getSubscription();
            setIsSubscribed(!!sub);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const subscribe = async () => {
        try {
            setLoading(true);
            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult === 'granted') {
                await pushService.subscribe();
                setIsSubscribed(true);
                toast.success('Paiement aux notifications push activé');
                return true;
            } else {
                toast.error('Les notifications sont bloquées ou refusées');
                return false;
            }
        } catch (error) {
            toast.error('Erreur lors de l\'activation des notifications');
            console.error(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        try {
            setLoading(true);
            await pushService.unsubscribe();
            setIsSubscribed(false);
            toast.success('Notifications push désactivées sur cet appareil');
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la désactivation');
        } finally {
            setLoading(false);
        }
    };

    return {
        isSupported,
        permission,
        isSubscribed,
        loading,
        subscribe,
        unsubscribe,
        checkSubscription
    };
}
