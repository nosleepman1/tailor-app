import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import { Sun, Moon, Search, Menu, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/api/axios';

export function Navbar({ onMenuClick }) {
    const { theme, toggleTheme } = useTheme();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef();

    useEffect(() => {
        // Fetch deadlines as notifications
        if (user && user.role !== 'admin') {
            api.get('/dashboard').then(({ data }) => {
                if (data.stats && data.stats.upcoming_deadlines) {
                    setNotifications(data.stats.upcoming_deadlines.map(o => ({
                        id: o.id,
                        title: `Commande #${o.id} - Échéance Proche`,
                        message: `La commande pour ${o.client?.full_name || 'Client inconnu'} est due le ${new Date(o.due_date).toLocaleDateString('fr-FR')}`,
                        date: new Date(o.due_date),
                        read: false
                    })));
                }
            }).catch(() => {});
        }
        
        // Push notification API check
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, [user]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifs(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notifRef]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotifClick = () => {
        setShowNotifs(!showNotifs);
        if (!showNotifs && unreadCount > 0) {
            setNotifications(notifications.map(n => ({...n, read: true})));
        }
    };

    return (
        <header className="h-16 flex flex-shrink-0 items-center justify-between px-6 bg-bg-elevated/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="md:hidden font-display font-bold text-lg text-text">
                    TailleurPro
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button 
                        onClick={handleNotifClick}
                        className="relative p-2 text-text-muted hover:text-text transition-colors rounded-full hover:bg-dark-100 dark:hover:bg-dark-800"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
                    </button>
                    
                    {showNotifs && (
                        <div className="absolute right-0 mt-2 w-80 bg-bg-elevated border border-border shadow-xl rounded-2xl overflow-hidden z-50 animate-slide-up">
                            <div className="px-4 py-3 border-b border-border/50 bg-dark-50/50 dark:bg-dark-900/50 flex justify-between items-center">
                                <h3 className="font-semibold text-text">Notifications</h3>
                                <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-0.5 rounded-full">{notifications.length}</span>
                            </div>
                            <div className="max-h-72 flex flex-col overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div key={n.id} className="p-4 border-b border-border/50 hover:bg-dark-50 dark:hover:bg-dark-800/30 transition-colors">
                                            <p className="text-sm font-semibold text-text">{n.title}</p>
                                            <p className="text-xs text-text-muted mt-1">{n.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-text-muted text-sm">Aucune notification.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={toggleTheme} className="p-2 text-text-muted hover:text-text transition-colors rounded-full hover:bg-dark-100 dark:hover:bg-dark-800">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <Button variant="ghost" size="icon" onClick={() => logout()} title="Déconnexion">
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
