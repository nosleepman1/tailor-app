import React from 'react';
import { useAuthStore } from '@/store/authStore';

export function Navbar({ onMenuClick }) {
    return (
        <header className="h-16 flex flex-shrink-0 items-center justify-between px-6 bg-bg-elevated/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="md:hidden font-display font-bold text-lg text-text">
                    TailleurPro
                </div>
            </div>
        </header>
    );
}
