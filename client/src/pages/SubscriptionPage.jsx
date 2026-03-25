import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createCheckout } from '@/services/subscriptionService';
import AlertBanner from '@/components/AlertBanner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Shield, Crown } from 'lucide-react';

export default function SubscriptionPage() {
    const [searchParams] = useSearchParams();
    const isExpired = searchParams.get('expired') === 'true';
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleSubscribe = async (planId) => {
        try {
            setLoadingPlan(planId);
            const { data } = await createCheckout(planId);
            if (data?.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 animate-page-enter">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-text">Abonnement TailleurPro</h2>
                    <p className="mt-2 text-text-muted">Choisissez le plan parfait pour votre atelier</p>
                </div>

                {isExpired && (
                    <AlertBanner 
                        type="warning" 
                        message="Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser l'application." 
                    />
                )}

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {/* Basic Plan */}
                    <Card hover className="relative flex flex-col">
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-text">Basic</h3>
                            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-text">
                                2 500 <span className="text-xl font-medium text-text-muted ml-1">FCFA</span>
                            </div>
                            <p className="mt-1 text-sm text-text-muted">/ mois</p>
                            
                            <ul className="mt-6 space-y-4">
                                {['Gestion des clients', 'Suivi des commandes', 'Tableau de bord basique'].map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-text-muted">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 border-t border-border mt-auto">
                            <Button 
                                className="w-full" 
                                onClick={() => handleSubscribe('basic')}
                                disabled={loadingPlan !== null}
                            >
                                {loadingPlan === 'basic' ? 'Redirection...' : 'S\'abonner (Basic)'}
                            </Button>
                        </div>
                    </Card>

                    {/* Premium Plan */}
                    <Card hover className="relative flex flex-col border-gold-500/30 ring-1 ring-gold-500/20 shadow-xl shadow-gold-500/5">
                        <div className="absolute top-0 right-0 -mt-3 mr-4">
                            <span className="bg-gold-500 text-bg text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Recommandé
                            </span>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="w-12 h-12 bg-gold-500/10 text-gold-500 rounded-xl flex items-center justify-center mb-4">
                                <Crown className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-text">Premium</h3>
                            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-text">
                                5 000 <span className="text-xl font-medium text-text-muted ml-1">FCFA</span>
                            </div>
                            <p className="mt-1 text-sm text-text-muted">/ mois</p>
                            
                            <ul className="mt-6 space-y-4">
                                {['Tout le plan Basic', 'Gestion des événements', 'Statistiques avancées', 'Support prioritaire'].map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-text-muted">
                                        <Check className="w-5 h-5 text-gold-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 border-t border-border mt-auto">
                            <Button 
                                className="w-full bg-gold-500 hover:bg-gold-600 text-bg" 
                                onClick={() => handleSubscribe('premium')}
                                disabled={loadingPlan !== null}
                            >
                                {loadingPlan === 'premium' ? 'Redirection...' : 'S\'abonner (Premium)'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
