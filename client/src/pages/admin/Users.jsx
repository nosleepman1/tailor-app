import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Scissors, Search, Plus, Phone, Check, Activity } from 'lucide-react';

export default function AdminUsers() {
    const [tailors, setTailors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    // Create Tailor Form State
    const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', pin: '' });
    const [creating, setCreating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTailors();
    }, []);

    async function fetchTailors() {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/tailors');
            setTailors(data);
        } catch (error) {
            console.error('Failed to load tailors', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        setCreating(true);
        setSuccessMessage('');
        try {
            await api.post('/admin/tailors', form);
            setSuccessMessage(`Tailleur ${form.name} créé avec succès !`);
            setShowForm(false);
            setForm({ name: '', phone: '', email: '', city: '', pin: '' });
            fetchTailors();
        } catch (error) {
            console.error('Failed to create tailor', error);
        } finally {
            setCreating(false);
        }
    }

    const filtered = tailors.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        (t.phone && t.phone.includes(search))
    );

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text">Gestion des Tailleurs</h1>
                    <p className="text-text-muted mt-1">Gérez le réseau d'ateliers professionnels</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto gap-2 border border-primary-500/20 shadow-sm">
                    <Plus className="w-4 h-4" /> Ajouter un Tailleur
                </Button>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl flex items-center gap-2 font-medium">
                    <Check className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {showForm && (
                <Card className="animate-slide-up bg-primary-50/30 dark:bg-primary-900/10 border-primary-500/30">
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreate} className="space-y-5">
                            <h3 className="font-semibold text-lg text-text border-b border-border/50 pb-2">Nouvel Atelier</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label="Nom de l'atelier / Tailleur" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                <Input label="Téléphone (Identifiant)" icon={Phone} required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                                <Input label="Email (Optionnel)" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                                <Input label="Ville" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                                <div className="md:col-span-2">
                                    <Input label="Code PIN Initial (6 chiffres recommandés)" type="password" required value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} />
                                    <p className="text-xs text-text-subtle mt-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Le tailleur utilisera son numéro de téléphone et ce PIN pour se connecter.</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                                <Button type="submit" isLoading={creating}>Enregistrer le Tailleur</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

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
                                <th className="px-6 py-4 font-semibold">Atelier</th>
                                <th className="px-6 py-4 font-semibold">Contact</th>
                                <th className="px-6 py-4 font-semibold">Localisation</th>
                                <th className="px-6 py-4 font-semibold text-right">Date d'inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-muted">Chargement...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-text-muted">Aucun tailleur trouvé.</td>
                                </tr>
                            ) : (
                                filtered.map(tailor => (
                                    <tr key={tailor.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center">
                                                    <Scissors className="w-5 h-5" />
                                                </div>
                                                <div className="font-semibold text-text">{tailor.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            <div>{tailor.phone || 'Non renseigné'}</div>
                                            <div className="text-xs mt-0.5">{tailor.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-muted">{tailor.city || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-right text-text-muted font-medium">
                                            {new Date(tailor.created_at).toLocaleDateString('fr-FR')}
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
