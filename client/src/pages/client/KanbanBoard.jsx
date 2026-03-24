import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Scissors, Clock, ArrowRight } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const COLUMNS = [
    { id: 'pending', title: 'En attente' },
    { id: 'in_progress', title: 'En cours' },
    { id: 'ready', title: 'Prêt' },
    { id: 'delivered', title: 'Livré' },
    { id: 'cancelled', title: 'Annulé' }
];

export default function KanbanBoard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMobileStatus, setSelectedMobileStatus] = useState('pending');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    useEffect(() => {
        api.get('/commandes').then(res => {
            setOrders(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    async function updateOrderStatus(orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order && order.status !== newStatus) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            try {
                await api.put(`/commandes/${orderId}`, { ...order, status: newStatus });
            } catch (err) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: order.status } : o));
            }
        }
    }

    async function handleDragEnd(event) {
        if (!event.over) return;
        updateOrderStatus(event.active.id, event.over.id);
    }

    async function moveOrderToNextStatus(order) {
        const currentIndex = COLUMNS.findIndex(c => c.id === order.status);
        if (currentIndex !== -1 && currentIndex < COLUMNS.length - 1) {
            updateOrderStatus(order.id, COLUMNS[currentIndex + 1].id);
        }
    }

    if (loading) return <div className="p-8 text-center text-text-muted animate-pulse">Chargement du Kanban...</div>;

    const mobileOrders = orders.filter(o => o.status === selectedMobileStatus);

    const getStatusClasses = (statusId, isActive) => {
        switch (statusId) {
            case 'pending': return isActive ? 'bg-slate-500 text-white border-slate-500 shadow-sm' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent';
            case 'in_progress': return isActive ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 bg-transparent';
            case 'ready': return isActive ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 bg-transparent';
            case 'delivered': return isActive ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 bg-transparent';
            case 'cancelled': return isActive ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 bg-transparent';
            default: return '';
        }
    };

    return (
        <div className="space-y-6 animate-page-enter">
            <div>
                <h1 className="text-2xl font-display font-bold text-text">Kanban des Commandes</h1>
                <p className="text-text-muted mt-1 hidden md:block">Glissez et déposez vos commandes pour mettre à jour leur avancement.</p>
                <p className="text-text-muted mt-1 md:hidden">Gérez l'avancement de vos commandes.</p>
            </div>

            {/* Version Mobile: Pills horizontaux + Cartes verticales */}
            <div className="md:hidden space-y-6">
                <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x no-scrollbar">
                    {COLUMNS.map(col => {
                        const count = orders.filter(o => o.status === col.id).length;
                        const isSelected = selectedMobileStatus === col.id;
                        return (
                            <button 
                                key={col.id}
                                onClick={() => setSelectedMobileStatus(col.id)}
                                className={`shrink-0 snap-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${isSelected ? 'bg-primary-600 text-white scale-105' : 'bg-bg-elevated text-text-muted border border-border hover:bg-dark-50'}`}
                            >
                                {col.title} <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${isSelected ? 'bg-white/20' : 'bg-dark-100 dark:bg-dark-800'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-4">
                    {mobileOrders.length > 0 ? (
                        mobileOrders.map(order => (
                            <Card key={order.id} className="p-5 border border-border/50">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-text text-lg flex items-center gap-2">
                                        <Scissors className="w-4 h-4 text-gold-500" />
                                        {order.client?.full_name}
                                    </h3>
                                    <span className="text-xs font-mono text-text-muted bg-dark-50 dark:bg-dark-900 px-2 py-1 rounded">#{order.id}</span>
                                </div>
                                <p className="text-sm text-text-muted mb-4">{order.fabric_description || 'Aucune description'}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-orange-500 font-medium bg-orange-500/10 px-2.5 py-1.5 rounded-lg">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(order.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="font-bold text-text-subtle mr-2">{order.price?.toLocaleString()} FCFA</div>
                                </div>

                                {/* Status Selector Pills */}
                                <div className="mt-4 flex overflow-x-auto gap-2 pb-2 -mx-1 px-1 snap-x no-scrollbar shrink-0">
                                    {COLUMNS.map(col => {
                                        const isActive = order.status === col.id;
                                        return (
                                            <button
                                                key={col.id}
                                                onClick={() => updateOrderStatus(order.id, col.id)}
                                                className={`snap-start shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                                    getStatusClasses(col.id, isActive)
                                                }`}
                                            >
                                                {col.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="py-12 text-center text-text-muted bg-dark-50/50 dark:bg-dark-900/50 rounded-2xl border border-dashed border-border/50">
                            Aucune commande dans ce statut.
                        </div>
                    )}
                </div>
            </div>

            {/* Version Desktop: DND Toolkit */}
            <div className="hidden md:block">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-200px)]">
                        {COLUMNS.map(col => (
                            <DesktopColumn key={col.id} column={col} orders={orders.filter(o => o.status === col.id)} />
                        ))}
                    </div>
                </DndContext>
            </div>
        </div>
    );
}

function DesktopColumn({ column, orders }) {
    const { isOver, setNodeRef } = useDroppable({ id: column.id });

    return (
        <div className="flex-1 min-w-[320px] flex flex-col bg-dark-50/50 dark:bg-dark-900/40 rounded-2xl border border-border/80 shadow-sm">
            <div className="p-4 border-b border-border/80 flex items-center justify-between bg-bg-elevated/50 rounded-t-2xl">
                <h3 className="font-semibold text-text uppercase tracking-wide text-sm">{column.title}</h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-600 border border-primary-500/20">
                    {orders.length}
                </span>
            </div>
            <div 
                ref={setNodeRef} 
                className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors ${isOver ? 'bg-primary-500/5' : ''}`}
            >
                {orders.map(order => (
                    <DraggableOrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}

function DraggableOrderCard({ order }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: order.id });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 scale-105' : ''} transition-transform`}
        >
            <Card className="p-4 border-none shadow-md hover:shadow-lg transition-shadow bg-bg-elevated">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-text text-sm flex items-center gap-2">
                        <Scissors className="w-3.5 h-3.5 text-primary-500" />
                        {order.client?.full_name}
                    </p>
                    <span className="text-xs text-text-subtle font-mono">#{order.id}</span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed">
                    {order.fabric_description || 'Aucune description fournie.'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        {new Date(order.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="font-bold text-text-subtle text-xs">
                        {order.price?.toLocaleString()} CFA
                    </div>
                </div>
            </Card>
        </div>
    );
}
