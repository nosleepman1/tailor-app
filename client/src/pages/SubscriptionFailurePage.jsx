import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function SubscriptionFailurePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4 text-center">
            <AlertTriangle className="w-16 h-16 text-gold-500 mb-6" />
            <h2 className="text-2xl font-bold text-text mb-2">Paiement Échoué ou Annulé</h2>
            <p className="text-text-muted mb-8 max-w-md">
                L'opération n'a pas pu aboutir. Vous pouvez réessayer de souscrire à un plan.
            </p>
            <Button onClick={() => navigate('/subscription')}>Retour aux Abonnements</Button>
        </div>
    );
}
