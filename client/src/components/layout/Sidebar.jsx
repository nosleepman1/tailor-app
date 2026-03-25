import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Users, Scissors, CalendarDays, X, Shield, Settings, User } from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
    const user = useAuthStore(state => state.user);
    const isAdmin = user?.role === 'admin';

    const tailorLinks = [
        { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Kanban Commandes', to: '/kanban', icon: CalendarDays },
        { name: 'Mes Clients', to: '/clients', icon: Users },
        { name: 'Événements & Commandes', to: '/events-orders', icon: Scissors },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', to: '/admin/dashboard', icon: Shield },
        { name: 'Gestion Tailleurs', to: '/admin/tailors', icon: Scissors },
        { name: 'Événements', to: '/admin/events', icon: CalendarDays },
        { name: 'Toutes les Commandes', to: '/admin/orders', icon: LayoutDashboard },
    ];

    const links = isAdmin ? adminLinks : tailorLinks;

    return (
        <>

            {/* Sidebar container */}
            <aside className="hidden md:flex sticky top-0 h-screen inset-y-0 left-0 z-50 w-72 bg-bg-elevated border-r border-border transition-transform duration-300 ease-in-out flex-col">
                <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-display font-bold text-lg shadow-sm">
                            T
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight text-text">TailorShop</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 text-text-muted hover:text-text">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3 bg-dark-50 dark:bg-dark-900/50 p-3 rounded-xl border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0)?.toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                            <p className="text-xs text-text-subtle truncate capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <p className="px-3 text-xs font-semibold text-text-subtle uppercase tracking-wider mb-2 mt-4">Menu Principal</p>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                                isActive 
                                    ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500" 
                                    : "text-text-muted hover:text-text hover:bg-dark-50 dark:hover:bg-dark-800/50"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={clsx("w-5 h-5", isActive ? "text-primary-600 dark:text-primary-500" : "text-text-subtle group-hover:text-text-muted")} />
                                    {link.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <NavLink
                        to="/settings"
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                            isActive 
                                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500" 
                                : "text-text-muted hover:text-text hover:bg-dark-50 dark:hover:bg-dark-800/50"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <Settings className={clsx("w-5 h-5", isActive ? "text-primary-600 dark:text-primary-500" : "text-text-subtle group-hover:text-text-muted")} />
                                Paramètres
                            </>
                        )}
                    </NavLink>
                </div>
            </aside>
        </>
    );
}