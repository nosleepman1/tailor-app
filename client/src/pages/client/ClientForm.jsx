import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User, Phone, MapPin, Mail, Save, Clock, FileText, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ClientForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const [form, setForm] = useState({ 
        full_name: '', phone: '', email: '', address: '', notes: '',
        measurements: {
            neck: '', chest: '', shoulder: '', arm_length: '', belly: '',
            boubou_length: '', pant_length: '', hips: '', thigh: '', biceps: ''
        }
    });
    const [showMeasurements, setShowMeasurements] = useState(false);
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    
    useEffect(() => {
        if (isEditing) {
            api.get(`/clients/${id}`).then(({ data }) => {
                setForm({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    notes: data.notes || '',
                    measurements: data.measurement || {
                        neck: '', chest: '', shoulder: '', arm_length: '', belly: '',
                        boubou_length: '', pant_length: '', hips: '', thigh: '', biceps: ''
                    }
                });
                if (data.measurement) setShowMeasurements(true);
                if (data.commandes) setRecentOrders(data.commandes.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
                setLoading(false);
            }).catch(() => navigate('/clients'));
        }
    }, [id, isEditing, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) await api.put(`/clients/${id}`, form);
            else await api.post(`/clients`, form);
            navigate('/clients');
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="space-y-6 animate-page-enter max-w-2xl mx-auto">
            <PageHeader 
                title={isEditing ? `Modifier ${form.full_name}` : 'Nouveau Client'} 
                backTo="/clients" 
            />
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input 
                            label="Nom Complet" 
                            icon={User} 
                            required 
                            value={form.full_name} 
                            onChange={e => setForm({...form, full_name: e.target.value})} 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                label="Téléphone" 
                                icon={Phone} 
                                value={form.phone} 
                                onChange={e => setForm({...form, phone: e.target.value})} 
                            />
                            <Input 
                                label="Email" 
                                type="email"
                                icon={Mail} 
                                value={form.email} 
                                onChange={e => setForm({...form, email: e.target.value})} 
                            />
                        </div>
                        <Input 
                            label="Adresse" 
                            icon={MapPin} 
                            value={form.address} 
                            onChange={e => setForm({...form, address: e.target.value})} 
                        />

                        <div className="flex flex-col gap-1.5 pt-2">
                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</label>
                            <textarea 
                                className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                rows="3"
                                placeholder="Préférences, remarques..."
                                value={form.notes}
                                onChange={e => setForm({...form, notes: e.target.value})}
                            />
                        </div>

                        <div className="pt-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full text-sm py-2"
                                onClick={() => setShowMeasurements(!showMeasurements)}
                            >
                                {showMeasurements ? 'Masquer les Mensurations' : '+ Ajouter des mesures'}
                            </Button>
                        </div>

                        {showMeasurements && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                                {Object.keys(form.measurements).map(key => {
                                    const labels = {
                                        neck: 'Cou (C)',
                                        chest: 'Poitrine (P)',
                                        shoulder: 'Épaule (É)',
                                        arm_length: 'Longueur Bras (L)',
                                        belly: 'Ventre (V)',
                                        boubou_length: 'Longueur Boubou (L)',
                                        pant_length: 'Longueur Pantalon (L)',
                                        hips: 'Fesses (F)',
                                        thigh: 'Cuisse (C)',
                                        biceps: 'Biceps (B)'
                                    };
                                    
                                    return (
                                        <div key={key} className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                                {labels[key] || key}
                                            </label>
                                            <Input
                                                type="number"
                                                value={form.measurements[key] || ''}
                                                onChange={e => setForm({
                                                    ...form,
                                                    measurements: { ...form.measurements, [key]: e.target.value }
                                                })}
                                                placeholder="cm"
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => navigate('/clients')}>
                                Annuler
                            </Button>
                            <Button type="submit" isLoading={saving} className="gap-2">
                                <Save className="w-4 h-4" /> Enregistrer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {isEditing && recentOrders.length > 0 && (
                <div className="mt-8 space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-display font-bold text-text">Dernières Commandes</h2>
                        {recentOrders.length > 5 && (
                            <Link to={`/events-orders`} className="text-sm font-semibold text-primary-600 hover:text-primary-500 flex items-center gap-1">
                                Voir Tout <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentOrders.slice(0, 5).map(order => (
                            <Link key={order.id} to={`/orders/${order.id}`}>
                                <Card className="hover:border-primary-500/30 hover:shadow-md transition-all h-full cursor-pointer">
                                    <CardContent className="p-4 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-xs text-text-muted bg-dark-50 dark:bg-dark-900/50 px-2 py-1 rounded-md">
                                                    #{order.id}
                                                </div>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="font-semibold text-text line-clamp-1 mb-1" title={order.fabric_description}>
                                                {order.fabric_description || 'Sans description'}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-text-subtle mt-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                Prévu: {order.due_date ? new Date(order.due_date).toLocaleDateString('fr-FR') : 'Non défini'}
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Avance</p>
                                                <p className="font-medium text-text mt-0.5">{order.deposit_paid ? order.deposit_paid.toLocaleString('fr-FR') + ' F' : '-'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Total</p>
                                                <p className="font-bold text-primary-600 mt-0.5">{order.price ? order.price.toLocaleString('fr-FR') + ' FCFA' : 'À définir'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
