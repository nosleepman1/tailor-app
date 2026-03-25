import axios from '@/api/axios';

const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const pushService = {
    async subscribe() {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw new Error('Push messaging is not supported.');
        }

        const registration = await navigator.serviceWorker.ready;

        // Fetch VAPID public key
        const response = await axios.get('/push/vapid-public-key');
        const vapidPublicKey = response.data.key;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(vapidPublicKey)
        });

        // Send subscription to backend
        await axios.post('/push/subscribe', subscription);
        return subscription;
    },

    async unsubscribe() {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            // Tell backend to remove it
            await axios.post('/push/unsubscribe', { endpoint: subscription.endpoint });
        }
    },

    async getSubscription() {
        if (!('serviceWorker' in navigator)) return null;
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    }
}
