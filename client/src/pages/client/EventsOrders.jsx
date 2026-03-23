import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { CalendarDays, Plus, Clock, Scissors } from 'lucide-react';

export default function EventsOrders() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/events').then(({ data }) => {
            setEvents(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="space-y-6 animate-pulse"><div className="h-10 w-48 bg-dark-200 dark:bg-dark-800 rounded-lg"></div><div className="h-64 bg-dark-200 dark:bg-dark-800 rounded-2xl"></div></div>;

    const isOrderVisible = (order) => {
        if (filter === 'all') return true;
        if (filter === 'cancelled') return order.status === 'cancelled';
        if (filter === 'in_progress') return ['pending', 'in_progress', 'ready'].includes(order.status);
        if (filter === 'paid') return order.price > 0 && Number(order.deposit_paid) >= Number(order.price);
        if (filter === 'near_delivery') {
            if (!order.due_date) return false;
            const due = new Date(order.due_date);
            const today = new Date();
            const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7 && order.status !== 'delivered' && order.status !== 'cancelled';
        }
        return true;
    };

    const displayEvents = events.map(e => ({
        ...e,
        commandes: e.commandes ? e.commandes.filter(isOrderVisible) : []
    })).filter(e => e.commandes.length > 0 || (filter === 'all' && new Date(e.date) > new Date(new Date().setDate(new Date().getDate() - 7))));

    return (
        <div className="space-y-6 animate-page-enter max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text">Événements & Commandes</h1>
                    <p className="text-text-muted mt-1">Vos commandes classées par événement ou échéance</p>
                </div>
                <Link to="/orders/new">
                    <Button className="w-full sm:w-auto gap-2">
                        <Plus className="w-4 h-4" /> Nouvelle Commande
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 hide-scrollbar">
                {[
                    { id: 'all', label: 'Toutes' },
                    { id: 'in_progress', label: 'En Cours' },
                    { id: 'near_delivery', label: 'Urgentes (7j)' },
                    { id: 'paid', label: 'Payées' },
                    { id: 'cancelled', label: 'Annulées' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.id ? 'bg-primary-600 text-white shadow-md' : 'bg-bg-elevated border border-border text-text-muted hover:text-text'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-6 md:before:left-1/2 before:w-px before:bg-border/50">
                {displayEvents.map((event, idx) => (
                    <div key={event.id} className={`relative flex items-start gap-6 md:justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        {/* Timeline dot */}
                        <div className="absolute left-6 md:left-1/2 -ml-2.5 mt-5 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-bg flex items-center justify-center z-10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        </div>

                        {/* Content */}
                        <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] w-full`}>
                            <Card hover>
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 bg-transparent rounded-t-2xl gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-dark-50 dark:bg-dark-800 shadow-sm">
                                            <CalendarDays className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-semibold text-text">{event.name}</h3>
                                            <p className="text-xs text-text-subtle flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {event.date ? new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : 'Date à définir'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-primary-600/10 text-primary-600 rounded-lg self-start sm:self-auto shrink-0">
                                        {event.commandes.length} doc(s)
                                    </span>
                                </div>
                                <CardContent className="p-0">
                                    {event.commandes.length > 0 ? (
                                        <div className="divide-y divide-border/50">
                                            {event.commandes.map(order => (
                                                <div key={order.id} className="p-4 flex flex-col gap-3 group hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm text-text flex items-center gap-2 truncate">
                                                                <Scissors className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                                                                <span className="truncate">{order.client?.full_name}</span>
                                                            </p>
                                                            <p className="text-xs text-text-subtle mt-1 line-clamp-1" title={order.fabric_description}>
                                                                {order.fabric_description || 'Aucune description'}
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 flex flex-col items-end gap-2">
                                                            <StatusBadge status={order.status} />
                                                            <Link to={`/orders/${order.id}`} className="sm:hidden mt-1">
                                                                <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">Détails</Button>
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-[10px] font-bold tracking-wider uppercase bg-dark-100 dark:bg-dark-800 text-text-muted px-2 py-1 rounded">
                                                            Total: {order.price ? order.price.toLocaleString('fr-FR') : 0} FCFA
                                                        </span>
                                                        <span className="text-[10px] font-bold tracking-wider uppercase bg-green-500/10 text-green-600 px-2 py-1 rounded">
                                                            Avance: {order.deposit_paid ? order.deposit_paid.toLocaleString('fr-FR') : 0} FCFA
                                                        </span>
                                                        {Number(order.price) > Number(order.deposit_paid) && (
                                                            <span className="text-[10px] font-bold tracking-wider uppercase bg-rose-500/10 text-rose-500 px-2 py-1 rounded border border-rose-500/20">
                                                                Reste: {(Number(order.price) - Number(order.deposit_paid)).toLocaleString('fr-FR')} FCFA
                                                            </span>
                                                        )}
                                                        {order.due_date && (
                                                            <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-500/10 text-primary-600 px-2 py-1 rounded flex items-center gap-1 sm:ml-auto">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(order.due_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="hidden sm:flex justify-end opacity-0 group-hover:opacity-100 transition-opacity mt-[-1rem]">
                                                        <Link to={`/orders/${order.id}`}>
                                                            <Button variant="ghost" size="sm" className="h-7 text-xs px-3">Voir Détails</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-sm text-text-subtle bg-bg-muted/30">
                                            Aucune commande pour cet événement actuellement.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
                {displayEvents.length === 0 && (
                    <div className="text-center py-12 text-text-muted">Aucun événement à afficher.</div>
                )}
            </div>
        </div>
    );
}
