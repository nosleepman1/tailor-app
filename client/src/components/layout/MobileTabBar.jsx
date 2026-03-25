import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Scissors, CalendarDays, Shield, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import clsx from 'clsx';

export function MobileTabBar() {
    const user = useAuthStore(state => state.user);
    const isAdmin = user?.role === 'admin';

    const tailorLinks = [
        { name: 'Accueil', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Kanban', to: '/kanban', icon: CalendarDays },
        { name: 'Clients', to: '/clients', icon: Users },
        { name: 'Commandes', to: '/events-orders', icon: Scissors },
    ];

    const adminLinks = [
        { name: 'Dashboard', to: '/admin/dashboard', icon: Shield },
        { name: 'Tailleurs', to: '/admin/tailors', icon: Scissors },
        { name: 'Commandes', to: '/admin/orders', icon: LayoutDashboard },
    ];

    const baseLinks = isAdmin ? adminLinks : tailorLinks;
    const links = [
        ...baseLinks,
        { name: 'Profil', to: '/settings', isProfile: true }
    ];

    return (
        <nav 
            className="md:hidden fixed bottom-0 inset-x-0 bg-bg-elevated/90 backdrop-blur-lg border-t border-border z-[100] flex items-center justify-around px-2"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(64px + env(safe-area-inset-bottom))' }}
        >
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                        isActive ? "text-primary-500" : "text-text-subtle hover:text-text-muted"
                    )}
                >
                    {({ isActive }) => (
                        <>
                            {link.isProfile ? (
                                user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className={clsx("w-6 h-6 rounded-full object-cover", isActive && "ring-2 ring-primary-500 border border-bg-elevated")} />
                                ) : (
                                    <User className={clsx("w-6 h-6", isActive && "fill-primary-500/20 stroke-[2.5px]")} />
                                )
                            ) : (
                                <link.icon className={clsx("w-6 h-6", isActive && "fill-primary-500/20 stroke-[2.5px]")} />
                            )}
                            <span className="text-[10px] font-medium tracking-wide">{link.name}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
