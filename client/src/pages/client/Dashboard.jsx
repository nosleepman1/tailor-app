import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, ClipboardList, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const user = useAuthStore(state => state.user);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data.stats);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 w-48 bg-dark-200 dark:bg-dark-800 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-dark-200 dark:bg-dark-800 rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8 animate-page-enter">
            <div>
                <h1 className="text-3xl font-display font-bold text-text">
                    Bonjour, {user?.name}
                </h1>
                <p className="text-text-muted mt-1">Voici un aperçu de votre atelier aujourd'hui.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Clients" 
                    value={stats.total_clients} 
                    icon={Users} 
                    color="text-blue-500" 
                    bg="bg-blue-500/10"
                />
                <StatCard 
                    title="Commandes Actives" 
                    value={stats.active_orders} 
                    icon={ClipboardList} 
                    color="text-orange-500" 
                    bg="bg-orange-500/10"
                />
                <StatCard 
                    title="Revenus du Mois" 
                    value={`${stats.revenue_month?.toLocaleString('fr-FR')} FCFA`} 
                    icon={TrendingUp} 
                    color="text-green-500" 
                    bg="bg-green-500/10"
                />
                <StatCard 
                    title="Prochaines Échéances" 
                    value={stats.upcoming_deadlines?.length || 0} 
                    icon={Clock} 
                    color="text-purple-500" 
                    bg="bg-purple-500/10"
                />
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold text-text">Récents & À Venir</h2>
                    <a href="/events-orders" className="text-sm font-semibold text-primary-600 hover:text-primary-500">Tout voir →</a>
                </div>
                
                {stats.upcoming_deadlines?.length > 0 ? (
                    <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x">
                        {stats.upcoming_deadlines.map(order => (
                            <Card key={order.id} className="min-w-[280px] max-w-[320px] shrink-0 snap-center hover:scale-[1.02] transition-transform">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <h3 className="font-semibold text-text truncate">{order.client?.full_name || 'Client inconnu'}</h3>
                                    <p className="text-sm text-text-muted mt-0.5 truncate">{order.fabric_description || 'Sans description'}</p>
                                    <p className="text-xs text-text-subtle mt-3 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        À livrer le {new Date(order.due_date).toLocaleDateString('fr-FR')}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-text-muted bg-dark-50/50 dark:bg-dark-900/50 rounded-2xl border border-dashed border-border/50">
                        <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Aucune commande à livrer prochainement.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-20 md:bottom-8 right-6 z-40 group">
                <div className="absolute bottom-full right-0 mb-4 items-end flex-col gap-3 hidden group-hover:flex">
                    <a href="/clients/new" className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-bg-elevated text-text font-medium shadow-xl hover:text-primary-600 transition whitespace-nowrap border border-border">
                        Nouveau Client <Users className="w-4 h-4" />
                    </a>
                    <a href="/orders/new" className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-bg-elevated text-text font-medium shadow-xl hover:text-gold-600 transition whitespace-nowrap border border-border">
                        Nouvelle Commande <ClipboardList className="w-4 h-4" />
                    </a>
                </div>
                <button className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-500 hover:scale-105 transition-all text-2xl font-light">
                    +
                </button>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <Card className="hover:scale-[1.02]">
            <CardContent className="flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{title}</p>
                    <p className="text-2xl font-bold text-text mt-1">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
