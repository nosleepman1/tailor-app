import { useState } from 'react';
import { useEvents, useCreateEvent } from '@/hooks/useEvents';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CalendarDays, Plus, Check } from 'lucide-react';

export default function AdminEvents() {
    const { data: events = [], isLoading: loading } = useEvents();
    const createEventMutation = useCreateEvent();
    const [showForm, setShowForm] = useState(false);
    
    const [form, setForm] = useState({ name: '', date: '', description: '', is_recurring: false });
    const [successMessage, setSuccessMessage] = useState('');

    async function handleCreate(e) {
        e.preventDefault();
        setSuccessMessage('');
        try {
            await createEventMutation.mutateAsync(form);
            setSuccessMessage(`Événement ${form.name} créé avec succès !`);
            setShowForm(false);
            setForm({ name: '', date: '', description: '', is_recurring: false });
        } catch (error) {
            console.error('Failed to create event', error);
        }
    }

    return (
        <div className="space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text">Gestion des Événements</h1>
                    <p className="text-text-muted mt-1">Créez des événements (Tabaski, Korité) visibles pour tous les tailleurs</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto gap-2">
                    <Plus className="w-4 h-4" /> Nouvel Événement
                </Button>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl flex items-center gap-2 font-medium">
                    <Check className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {showForm && (
                <Card className="animate-slide-up">
                    <CardContent className="pt-6">
                        <form onSubmit={handleCreate} className="space-y-5">
                            <h3 className="font-semibold text-lg text-text border-b border-border/50 pb-2">Nouvel Événement</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label="Nom de l'événement" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                <Input label="Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                                
                                <div className="md:col-span-2 flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Description</label>
                                    <textarea 
                                        className="w-full bg-bg-elevated border border-border text-text text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        rows="2"
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="isRecurring" 
                                        checked={form.is_recurring} 
                                        onChange={(e) => setForm({...form, is_recurring: e.target.checked})}
                                        className="rounded border-border text-primary-600" 
                                    />
                                    <label htmlFor="isRecurring" className="text-sm text-text-muted cursor-pointer">
                                        Événement récurrent annuel
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Annuler</Button>
                                <Button type="submit" isLoading={createEventMutation.isPending}>Enregistrer</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-text-muted col-span-full">Chargement...</div>
                ) : events.length === 0 ? (
                    <div className="text-text-muted col-span-full bg-dark-50/50 dark:bg-dark-900/50 p-8 rounded-2xl text-center border border-dashed border-border">
                        <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        Aucun événement créé.
                    </div>
                ) : (
                    events?.map(event => (
                        <Card key={event.id} hover className="relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-primary-500/20 transition-colors"></div>
                            <CardContent className="relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    {event.is_recurring && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gold-500/20 text-gold-600 rounded">Récurrent</span>
                                    )}
                                </div>
                                <h3 className="font-display font-semibold text-lg text-text mb-1">{event.name}</h3>
                                <p className="text-sm text-text-subtle mb-4">
                                    {event.date ? new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à définir'}
                                </p>
                                {event.description && <p className="text-sm text-text-muted line-clamp-2">{event.description}</p>}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
