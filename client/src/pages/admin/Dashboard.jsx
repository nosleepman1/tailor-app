import { useAuthStore } from '@/store/authStore';
import { useDashboardStats } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Scissors, ClipboardList, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const user = useAuthStore(state => state.user);
    const { data: stats, isLoading: loading } = useDashboardStats();

    if (loading) {
        return <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 bg-dark-200 dark:bg-dark-800 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-dark-200 dark:bg-dark-800 rounded-2xl"></div>)}
            </div>
        </div>;
    }

    if (!stats) return null;

    const chartData = [
        { name: 'Tailleurs', value: stats.total_tailors },
        { name: 'Clients (Global)', value: stats.total_clients },
        { name: 'Commandes En Cours', value: stats.active_orders },
        { name: 'Événements', value: stats.total_events },
    ];

    return (
        <div className="space-y-8 animate-page-enter">
            <div>
                <h1 className="text-3xl font-display font-bold text-text">
                    Espace Administrateur, {user?.name}
                </h1>
                <p className="text-text-muted mt-1">Vue globale de l'activité du réseau TailleurPro.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Tailleurs Inscrits" 
                    value={stats.total_tailors} 
                    icon={Scissors} 
                    color="text-primary-500" 
                    bg="bg-primary-500/10"
                />
                <StatCard 
                    title="Clients Enregistrés" 
                    value={stats.total_clients} 
                    icon={Users} 
                    color="text-blue-500" 
                    bg="bg-blue-500/10"
                />
                <StatCard 
                    title="Commandes Globales" 
                    value={stats.active_orders} 
                    icon={ClipboardList} 
                    color="text-orange-500" 
                    bg="bg-orange-500/10"
                />
                <StatCard 
                    title="Événements Planifiés" 
                    value={stats.total_events} 
                    icon={TrendingUp} 
                    color="text-green-500" 
                    bg="bg-green-500/10"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Aperçu de l'Activité Réseau</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)' }} />
                                <Tooltip 
                                    cursor={{ fill: 'var(--color-dark-50)' }} 
                                    contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px' }} 
                                />
                                <Bar dataKey="value" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <Card hover>
            <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-text-muted">{title}</p>
                    <p className="text-2xl font-bold text-text mt-0.5">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
