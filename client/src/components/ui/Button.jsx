import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled, 
    className, 
    ...props 
}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-60 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/25 focus:ring-primary-500 active:scale-95',
        secondary: 'bg-dark-100 text-dark-800 dark:bg-dark-800 dark:text-dark-100 hover:bg-dark-200 dark:hover:bg-dark-700 focus:ring-dark-400 active:scale-95',
        ghost: 'bg-transparent text-text-muted hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-text focus:ring-dark-300 active:scale-95',
        danger: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 focus:ring-red-500 active:scale-95',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
        icon: 'p-2',
    };

    return (
        <button
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
}
