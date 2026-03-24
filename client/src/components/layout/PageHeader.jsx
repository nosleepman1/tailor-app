import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PageHeader({ title, action, backTo = -1 }) {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 z-20 bg-bg/95 backdrop-blur-sm pt-2 pb-4 mb-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate(backTo)} 
                    className="p-2 -ml-2 rounded-full text-text-muted hover:text-text hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-display font-bold text-text truncate">{title}</h1>
            </div>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
}
