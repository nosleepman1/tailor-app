import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Phone, MapPin, Mail, Save } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function ClientForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const [form, setForm] = useState({ 
        full_name: '', phone: '', email: '', address: '', notes: '' 
    });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        if (isEditing) {
            api.get(`/clients/${id}`).then(({ data }) => {
                setForm({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    notes: data.notes || ''
                });
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
        </div>
    );
}
