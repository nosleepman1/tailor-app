import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Search, Scissors, User } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Technically backend doesn't have an admin-only orders endpoint yet, but usually admins can see all.
        // Assuming /commandes for admin returns all if Policy allows.
        api.get('/commandes').then(({ data }) => {
            // For now, if no tailor-specific logic, let's just render what we get.
            setOrders(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const filtered = orders.filter(o => 
        (o.client?.full_name?.toLowerCase().includes(search.toLowerCase())) ||
        (o.tailor?.name?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text">Toutes les Commandes</h1>
                    <p className="text-text-muted mt-1">Supervision globale de l'activité du réseau</p>
                </div>
            </div>

            <Card>
                <div className="p-4 border-b border-border bg-dark-50/50 dark:bg-dark-900/50 rounded-t-2xl">
                    <Input 
                        icon={Search} 
                        placeholder="Rechercher par client ou atelier..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="max-w-md bg-bg-elevated"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase text-text-subtle bg-dark-50/50 dark:bg-dark-900/50">
                                <th className="px-6 py-4 font-semibold">Atelier</th>
                                <th className="px-6 py-4 font-semibold">Client</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Échéance</th>
                                <th className="px-6 py-4 font-semibold text-right">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Chargement...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Aucune commande trouvée.</td>
                                </tr>
                            ) : (
                                filtered.map(order => (
                                    <tr key={order.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text flex items-center gap-2">
                                            <Scissors className="w-4 h-4 text-primary-500" />
                                            {order.tailor?.name || `Atelier #${order.tailor_id}`}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted flex items-center gap-2">
                                            <User className="w-4 h-4 text-gold-500" />
                                            {order.client?.full_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted max-w-xs truncate">
                                            {order.fabric_description || 'Sans description'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            {order.due_date ? new Date(order.due_date).toLocaleDateString('fr-FR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
