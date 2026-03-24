import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, ClipboardList, TrendingUp, Clock, AlertCircle, Phone, MessageCircle, DollarSign, CalendarCheck } from 'lucide-react';

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
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mt-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 bg-dark-200 dark:bg-dark-800 rounded-xl"></div>)}
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
                <p className="text-text-muted mt-1">Aperçu financier et opérationnel de votre atelier.</p>
            </div>

            {/* Compact KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard 
                    title="Total Clients" 
                    value={stats.total_clients} 
                    icon={Users} 
                    color="text-blue-500" 
                    bg="bg-blue-500/10"
                />
                <StatCard 
                    title="Commandes" 
                    value={stats.active_orders} 
                    icon={ClipboardList} 
                    color="text-orange-500" 
                    bg="bg-orange-500/10"
                />
                <StatCard 
                    title="Dues Semaine" 
                    value={stats.orders_due_this_week || 0} 
                    icon={CalendarCheck} 
                    color="text-red-500" 
                    bg="bg-red-500/10"
                />
                <StatCard 
                    title="Revenu Total" 
                    value={`${(stats.total_revenue || 0).toLocaleString('fr-FR')} F`} 
                    icon={DollarSign} 
                    color="text-green-500" 
                    bg="bg-green-500/10"
                />
                <StatCard 
                    title="Revenus Mois" 
                    value={`${(stats.revenue_month || 0).toLocaleString('fr-FR')} F`} 
                    icon={TrendingUp} 
                    color="text-teal-500" 
                    bg="bg-teal-500/10"
                />
                <StatCard 
                    title="Restes à Payer" 
                    value={`${(stats.total_debt || 0).toLocaleString('fr-FR')} F`} 
                    icon={AlertCircle} 
                    color="text-rose-500" 
                    bg="bg-rose-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Deadlines */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-text">Prochaines Échéances</h2>
                        <a href="/events-orders" className="text-sm font-semibold text-primary-600 hover:text-primary-500">Voir tout</a>
                    </div>
                    
                    {stats.upcoming_deadlines?.length > 0 ? (
                        <div className="grid gap-3">
                            {stats.upcoming_deadlines.map(order => (
                                <Card key={order.id} className="hover:border-primary-500/30 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-text truncate max-w-[200px]">{order.client?.full_name || 'Inconnu'}</h3>
                                            <p className="text-xs text-text-subtle mt-1 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                Due {new Date(order.due_date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-text-muted bg-dark-50/50 dark:bg-dark-900/50 rounded-2xl border border-dashed border-border/50">
                            <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Aucune commande urgente.</p>
                        </div>
                    )}
                </div>

                {/* Debtors List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-text flex items-center gap-2">
                            Clients en Dette <span className="bg-rose-500/10 text-rose-500 text-xs px-2 py-0.5 rounded-full">{stats.debtors?.length || 0}</span>
                        </h2>
                    </div>
                    
                    {stats.debtors?.length > 0 ? (
                        <div className="grid gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                            {stats.debtors.map((debtor, idx) => {
                                const phone = debtor.client?.phone || '';
                                const cleanPhone = phone.replace(/\D/g, '');
                                const message = `Bonjour ${debtor.client?.full_name}, c'est l'atelier TailleurPro. Nous vous rappelons un solde de ${(debtor.amount_owed).toLocaleString('fr-FR')} FCFA. Merci de nous contacter.`;
                                const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('221') ? cleanPhone : '221'+cleanPhone}?text=${encodeURIComponent(message)}` : '#';
                                
                                return (
                                    <div key={idx} className="bg-bg-elevated border border-border p-4 rounded-xl flex items-center justify-between hover:shadow-md transition-all">
                                        <div>
                                            <h3 className="font-semibold text-text">{debtor.client?.full_name || 'Inconnu'}</h3>
                                            <p className="text-rose-500 font-bold text-sm mt-0.5">-{debtor.amount_owed.toLocaleString('fr-FR')} F</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {phone && (
                                                <>
                                                    <a href={`tel:${phone}`} title="Appeler" className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-full transition-colors">
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                    <a href={waLink} target="_blank" rel="noreferrer" title="WhatsApp" className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-full transition-colors">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-text-muted bg-dark-50/50 dark:bg-dark-900/50 rounded-2xl border border-dashed border-border/50">
                            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Aucun client n'a de dette.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Revenue By Event */}
            <div className="space-y-4 pt-4 border-t border-border">
                <h2 className="text-xl font-display font-bold text-text">Revenus par Événement</h2>
                {stats.revenue_by_event?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.revenue_by_event.map((ev, idx) => (
                            <div key={idx} className="bg-bg-elevated border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
                                <span className="text-xs font-semibold text-text-muted uppercase mb-1">{ev.event}</span>
                                <span className="text-lg font-bold text-green-500">{ev.total_revenue.toLocaleString('fr-FR')} F</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-text-muted italic">Données insuffisantes.</p>
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
        <div className="bg-bg-elevated border border-border rounded-xl p-4 hover:shadow-lg transition-all flex flex-col items-start gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-[100px]">{title}</p>
                <p className="text-lg font-bold text-text mt-0.5 tracking-tight">{value}</p>
            </div>
        </div>
    );
}
