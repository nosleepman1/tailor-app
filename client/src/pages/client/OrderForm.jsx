import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Scissors, FileText, CalendarDays, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

export default function OrderForm() {
    const navigate = useNavigate();
    
    const [clients, setClients] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [form, setForm] = useState({ 
        client_id: '', event_id: '', fabric_description: '', 
        status: 'pending', price: '', deposit_paid: '', due_date: '', due_date_remaining: '', notes: '' 
    });
    const [images, setImages] = useState({ model: null, fabric: null });

    useEffect(() => {
        Promise.all([api.get('/clients'), api.get('/events')]).then(([cliRes, evtRes]) => {
            setClients(cliRes.data);
            setEvents(evtRes.data);
            setLoading(false);
        });
    }, []);

    const [isNewClient, setIsNewClient] = useState(false);
    const [newClientData, setNewClientData] = useState({ 
        full_name: '', phone: '',
        measurements: {
            neck: '', chest: '', shoulder: '', arm_length: '', belly: '',
            boubou_length: '', pant_length: '', hips: '', thigh: '', biceps: ''
        }
    });
    const [showMeasurements, setShowMeasurements] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            
            Object.keys(form).forEach(key => {
                if (form[key]) formData.append(key, form[key]);
            });

            if (isNewClient) {
                formData.append('new_client[full_name]', newClientData.full_name);
                if (newClientData.phone) formData.append('new_client[phone]', newClientData.phone);
                
                if (newClientData.measurements) {
                    Object.keys(newClientData.measurements).forEach(mKey => {
                        if (newClientData.measurements[mKey]) {
                            formData.append(`new_client[measurements][${mKey}]`, newClientData.measurements[mKey]);
                        }
                    });
                }
            }

            if (images.model) formData.append('images[model]', images.model);
            if (images.fabric) formData.append('images[fabric]', images.fabric);

            await api.post('/commandes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/events-orders');
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div>Chargement du formulaire...</div>;

    return (
        <div className="space-y-6 animate-page-enter max-w-2xl mx-auto">
            <PageHeader 
                title="Nouvelle Commande" 
                backTo="/events-orders" 
                action={null}
            />

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="bg-transparent p-4 rounded-xl border border-border/50 space-y-4">
                            <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                <h3 className="font-semibold text-text text-sm uppercase tracking-wider">Sélection du Client</h3>
                                <div className="flex bg-bg-elevated border border-border rounded-lg p-1">
                                    <button 
                                        type="button"
                                        onClick={() => setIsNewClient(false)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!isNewClient ? 'bg-primary-500/10 text-primary-600' : 'text-text-muted hover:text-text'}`}
                                    >
                                        Client Existant
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setIsNewClient(true)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isNewClient ? 'bg-primary-500/10 text-primary-600' : 'text-text-muted hover:text-text'}`}
                                    >
                                        Nouveau Client
                                    </button>
                                </div>
                            </div>

                            {!isNewClient ? (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Client Existant</label>
                                    <select 
                                        className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        value={form.client_id}
                                        onChange={e => setForm({...form, client_id: e.target.value})}
                                        required={!isNewClient}
                                    >
                                        <option value="">-- Rechercher / Sélectionner un client --</option>
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.phone || 'Sans numéro'})</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-slide-up">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Nom Complet</label>
                                            <input 
                                                type="text"
                                                className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                                value={newClientData.full_name}
                                                onChange={e => setNewClientData({...newClientData, full_name: e.target.value})}
                                                required={isNewClient}
                                                placeholder="Ex: Aissatou Diallo"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Téléphone</label>
                                            <input 
                                                type="text"
                                                className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                                value={newClientData.phone}
                                                onChange={e => setNewClientData({...newClientData, phone: e.target.value})}
                                                placeholder="Ex: 77 123 45 67"
                                            />
                                        </div>
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
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-slide-up">
                                            {Object.keys(newClientData.measurements).map(key => {
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
                                                            value={newClientData.measurements[key] || ''}
                                                            onChange={e => setNewClientData({
                                                                ...newClientData,
                                                                measurements: { ...newClientData.measurements, [key]: e.target.value }
                                                            })}
                                                            placeholder="cm"
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5 pt-2">
                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Événement Associé (Optionnel)</label>
                            <select 
                                className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={form.event_id}
                                onChange={e => setForm({...form, event_id: e.target.value})}
                            >
                                <option value="">-- Sans événement (Commande Générale) --</option>
                                {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                        </div>
                        
                        <Input 
                            label="Description du Tissu / Modèle" 
                            icon={Scissors} 
                            value={form.fabric_description} 
                            onChange={e => setForm({...form, fabric_description: e.target.value})} 
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5 animate-slide-up">
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Image du Modèle</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary-500/10 file:text-primary-600 hover:file:bg-primary-500/20"
                                    onChange={e => setImages({...images, model: e.target.files[0]})}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5 animate-slide-up">
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Image du Tissu</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-primary-500/10 file:text-primary-600 hover:file:bg-primary-500/20"
                                    onChange={e => setImages({...images, fabric: e.target.files[0]})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input 
                                label="Date de Livraison Prévue" 
                                type="date"
                                icon={CalendarDays} 
                                value={form.due_date} 
                                onChange={e => setForm({...form, due_date: e.target.value})} 
                            />
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Statut</label>
                                <select 
                                    className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={form.status}
                                    onChange={e => setForm({...form, status: e.target.value})}
                                >
                                    <option value="pending">En attente (Non commencé)</option>
                                    <option value="in_progress">En cours (Couture)</option>
                                    <option value="ready">Prêt pour livraison</option>
                                    <option value="delivered">Livré</option>
                                    <option value="cancelled">Annulé</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                            <Input 
                                label="Prix Total (FCFA)" 
                                type="number"
                                icon={DollarSign} 
                                value={form.price} 
                                onChange={e => setForm({...form, price: e.target.value})} 
                            />
                            <Input 
                                label="Avance Payée (FCFA)" 
                                type="number"
                                icon={DollarSign} 
                                value={form.deposit_paid} 
                                onChange={e => setForm({...form, deposit_paid: e.target.value})} 
                            />
                        </div>

                        {(Number(form.price || 0) > Number(form.deposit_paid || 0)) && (
                            <div className="flex flex-col gap-1.5 animate-slide-up">
                                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Date de Complément (Reste à payer)</label>
                                <Input 
                                    type="date"
                                    icon={CalendarDays} 
                                    value={form.due_date_remaining || ''} 
                                    onChange={e => setForm({...form, due_date_remaining: e.target.value})} 
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5 pt-2">
                            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes / Mesures Spécifiques</label>
                            <textarea 
                                className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                rows="3"
                                placeholder="Instructions spéciales pour cette commande..."
                                value={form.notes}
                                onChange={e => setForm({...form, notes: e.target.value})}
                            />
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => navigate('/events-orders')}>
                                Annuler
                            </Button>
                            <Button type="submit" isLoading={saving} className="gap-2 bg-gold-500 hover:bg-gold-600 focus:ring-gold-500 text-white">
                                <FileText className="w-4 h-4" /> Créer Commande
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
