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

    useEffect(() => {
        api.get('/events').then(({ data }) => {
            setEvents(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="animate-pulse">Chargement des événements...</div>;

    // Filter events that have commandes for this tailor OR are upcoming standard events.
    const relevantEvents = events.filter(e => e.commandes.length > 0 || new Date(e.date) > new Date(new Date().setDate(new Date().getDate() - 7)));

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

            <div className="space-y-8 mt-8 relative before:absolute before:inset-y-0 before:left-6 md:before:left-1/2 before:w-px before:bg-border/50">
                {relevantEvents.map((event, idx) => (
                    <div key={event.id} className={`relative flex items-start gap-6 md:justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        {/* Timeline dot */}
                        <div className="absolute left-6 md:left-1/2 -ml-2.5 mt-5 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-bg flex items-center justify-center z-10 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        </div>

                        {/* Content */}
                        <div className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)]`}>
                            <Card hover>
                                <div className="p-4 border-b border-border/50 bg-transparent rounded-t-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white dark:bg-dark-800 shadow-sm">
                                            <CalendarDays className="w-5 h-5 text-primary-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-semibold text-text">{event.name}</h3>
                                            <p className="text-xs text-text-subtle flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {event.date ? new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à définir'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 bg-primary-600/10 text-primary-600 rounded-md">
                                        {event.commandes.length} commande(s)
                                    </span>
                                </div>
                                <CardContent className="p-0">
                                    {event.commandes.length > 0 ? (
                                        <div className="divide-y divide-border/50">
                                            {event.commandes.map(order => (
                                                <div key={order.id} className="p-4 flex items-center justify-between group">
                                                    <div>
                                                        <p className="font-semibold text-sm text-text flex items-center gap-2">
                                                            <Scissors className="w-3.5 h-3.5 text-gold-500" />
                                                            {order.client?.full_name}
                                                        </p>
                                                        <p className="text-xs text-text-subtle mt-1 truncate max-w-[200px]">
                                                            {order.fabric_description || 'Aucune description'}
                                                        </p>
                                                        <p className="text-xs font-medium text-text-muted mt-1.5 bg-dark-50 dark:bg-dark-800 inline-block px-2 py-0.5 rounded">
                                                            Prix: {order.price?.toLocaleString('fr-FR')} FCFA
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <StatusBadge status={order.status} />
                                                        <Link to={`/orders/${order.id}`}>
                                                            <Button variant="ghost" size="sm" className="h-7 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">Détails</Button>
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
                {relevantEvents.length === 0 && (
                    <div className="text-center py-12 text-text-muted">Aucun événement à afficher.</div>
                )}
            </div>
        </div>
    );
}
