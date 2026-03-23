import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { User, Phone, CalendarDays, Scissors, Clock, DollarSign, Plus, Edit2 } from 'lucide-react';

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/commandes/${id}`).then(({ data }) => {
            setOrder(data);
            setLoading(false);
        }).catch(() => {
            navigate('/events-orders');
        });
    }, [id, navigate]);

    async function handleAddPayment(e) {
        e.preventDefault();
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) return;

        setIsSubmitting(true);
        try {
            const newDeposit = (parseFloat(order.deposit_paid) || 0) + amount;
            const payload = {
                client_id: order.client_id,
                status: order.status,
                deposit_paid: newDeposit
            };
            const { data } = await api.put(`/commandes/${id}`, payload);
            setOrder(data);
            setShowPaymentModal(false);
            setPaymentAmount('');
        } catch (error) {
            console.error('Erreur lors du paiement', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <div className="p-8 text-center animate-pulse">Chargement de la commande...</div>;
    if (!order) return null;

    const price = parseFloat(order.price) || 0;
    const paid = parseFloat(order.deposit_paid) || 0;
    const remaining = Math.max(0, price - paid);
    const progressPercent = price > 0 ? Math.min(100, Math.round((paid / price) * 100)) : 0;

    return (
        <div className="space-y-6 animate-page-enter max-w-3xl mx-auto">
            <PageHeader 
                title={`Commande #${order.id}`} 
                backTo="/events-orders" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations Principales */}
                <Card className="md:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-xl">
                                    {order.client?.full_name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-display font-bold text-text">{order.client?.full_name}</h2>
                                    <div className="flex items-center gap-4 text-sm text-text-muted mt-1">
                                        {order.client?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {order.client.phone}</span>}
                                    </div>
                                </div>
                            </div>
                            <StatusBadge status={order.status} className="text-sm px-3 py-1" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                            <div>
                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Détails du Modèle</p>
                                <p className="text-text flex items-start gap-2">
                                    <Scissors className="w-4 h-4 mt-0.5 text-primary-500" />
                                    {order.fabric_description || 'Aucune description fournie.'}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Échéance</p>
                                    <p className="text-text flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        {order.due_date ? new Date(order.due_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à définir'}
                                    </p>
                                </div>
                                {order.event && (
                                    <div>
                                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Événement Associé</p>
                                        <p className="text-text flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4 text-gold-500" />
                                            {order.event.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section Paiement Multi-étapes */}
                <Card className="md:col-span-2 overflow-hidden border-gold-500/20">
                    <div className="bg-gold-500/10 p-4 border-b border-gold-500/20 flex items-center justify-between">
                        <h3 className="font-semibold text-gold-700 dark:text-gold-400 flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Suivi des Paiements
                        </h3>
                        {remaining > 0 && (
                            <Button size="sm" onClick={() => setShowPaymentModal(true)} className="bg-gold-500 hover:bg-gold-600 focus:ring-gold-500 text-white gap-1.5 h-8">
                                <Plus className="w-3.5 h-3.5" /> Versement
                            </Button>
                        )}
                    </div>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <div className="p-4 rounded-xl bg-bg-elevated border border-border text-center">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Prix Total</p>
                                <p className="text-xl font-bold text-text">{price.toLocaleString()} FCFA</p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-green-700 dark:text-green-400">
                                <p className="text-xs uppercase tracking-wider font-semibold mb-1">Total Payé</p>
                                <p className="text-xl font-bold">{paid.toLocaleString()} FCFA</p>
                            </div>
                            <div className={`p-4 rounded-xl border text-center ${remaining > 0 ? 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'}`}>
                                <p className="text-xs uppercase tracking-wider font-semibold mb-1">Reste à Payer</p>
                                <p className="text-xl font-bold">{remaining.toLocaleString()} FCFA</p>
                            </div>
                        </div>

                        {/* Barre de Progression */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-text-muted">Progression du paiement</span>
                                <span className="text-sm font-bold text-text">{progressPercent}%</span>
                            </div>
                            <div className="h-3 w-full bg-border rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-out ${progressPercent === 100 ? 'bg-green-500' : 'bg-gold-500'}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes de Commande */}
                {order.notes && (
                    <Card className="md:col-span-2">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Notes & Mesures</h3>
                            <div className="p-4 rounded-xl bg-dark-50/50 dark:bg-dark-900/50 border border-border text-sm text-text whitespace-pre-line leading-relaxed">
                                {order.notes}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Modal de Paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md animate-slide-up shadow-2xl">
                        <div className="p-4 border-b border-border/50 flex justify-between items-center bg-bg-elevated/50 rounded-t-2xl">
                            <h3 className="font-bold text-lg text-text">Ajouter un Versement</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-text-muted hover:text-text p-2 rounded-full hover:bg-dark-50 dark:hover:bg-dark-800 transition">✕</button>
                        </div>
                        <CardContent className="p-6">
                            <form onSubmit={handleAddPayment} className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-text-muted mb-1 block">Montant du versement (FCFA)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="w-5 h-5 text-text-muted" />
                                        </div>
                                        <input 
                                            type="number"
                                            className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-lg font-medium"
                                            value={paymentAmount}
                                            onChange={e => setPaymentAmount(e.target.value)}
                                            max={remaining}
                                            required
                                            autoFocus
                                            placeholder={`Ex: ${remaining}`}
                                        />
                                    </div>
                                    <p className="text-xs text-text-subtle mt-2">Le montant maximum recommandable est le reste à payer: {remaining.toLocaleString()} FCFA.</p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" isLoading={isSubmitting} className="flex-1 bg-gold-500 hover:bg-gold-600 focus:ring-gold-500 text-white">
                                        Confirmer le paiement
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
