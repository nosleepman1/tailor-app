import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/clients').then(({ data }) => {
            setClients(data.data);
            
            setLoading(false);
        });
    }, []);

    const filtered = clients.filter(c => 
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
    );

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text">Mes Clients</h1>
                    <p className="text-text-muted mt-1">Gérez votre base de clientèle</p>
                </div>
                <Link to="/clients/new">
                    <Button className="w-full sm:w-auto gap-2">
                        <Plus className="w-4 h-4" /> Nouveau Client
                    </Button>
                </Link>
            </div>

            <Card>
                <div className="p-4 border-b border-border bg-transparent rounded-t-2xl">
                    <Input 
                        icon={Search} 
                        placeholder="Rechercher par nom ou téléphone..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="max-w-md bg-bg-elevated"
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase text-text-subtle bg-transparent">
                                <th className="px-6 py-4 font-semibold">Nom</th>
                                <th className="px-6 py-4 font-semibold">Téléphone</th>
                                <th className="px-6 py-4 font-semibold">Commandes Actives</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                                        Chargement...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-muted">
                                        Aucun client trouvé.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(client => (
                                    <tr key={client.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                                                    {client.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-text">{client.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted flex items-center gap-2">
                                            {client.phone ? (
                                                <><Phone className="w-4 h-4" /> {client.phone}</>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {client.active_orders_count > 0 ? (
                                                <span className="badge badge-gold">{client.active_orders_count} en cours</span>
                                            ) : (
                                                <span className="text-text-subtle text-sm">Aucune</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/clients/${client.id}/edit`}>
                                                <Button variant="ghost" size="sm">Gérer</Button>
                                            </Link>
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
