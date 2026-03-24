import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '@/services/subscriptionService';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useSubscriptionContext } from '@/context/SubscriptionContext';

export default function SubscriptionSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('ref');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const { refreshSubscription } = useSubscriptionContext();

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            return;
        }

        let isMounted = true;
        const verify = async () => {
            try {
                const { data } = await verifyPayment(reference);
                if (!isMounted) return;
                
                if (data.status === 'active') {
                    setStatus('success');
                    refreshSubscription();
                } else {
                    setStatus('error');
                }
            } catch (err) {
                if (isMounted) setStatus('error');
            }
        };

        verify();
        return () => { isMounted = false; };
    }, [reference, refreshSubscription]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-4">
                <Loader />
                <p className="text-text-muted">Vérification de votre paiement...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
                <XCircle className="w-16 h-16 text-rose-500 mb-6" />
                <h2 className="text-2xl font-bold text-text mb-2">Erreur de vérification</h2>
                <p className="text-text-muted mb-8 max-w-md">
                    Nous n'avons pas pu valider votre paiement ou celui-ci a échoué.
                </p>
                <Button onClick={() => navigate('/subscription')}>Réessayer</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-text mb-2">Paiement Réussi !</h2>
            <p className="text-text-muted mb-8 max-w-md">
                Votre abonnement a été activé avec succès. Merci de votre confiance.
            </p>
            <Button onClick={() => navigate('/dashboard')}>Aller au Tableau de Bord</Button>
        </div>
    );
}
