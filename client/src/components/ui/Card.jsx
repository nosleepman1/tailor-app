import React from 'react';
import clsx from 'clsx';

export function Card({ children, className, hover = false, ...props }) {
    return (
        <div 
            className={clsx(
                'bg-bg-elevated backdrop-blur-md border border-border rounded-2xl shadow-sm transition-all duration-300',
                hover && 'hover:shadow-md hover:border-primary-500/30 hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return (
        <div className={clsx('px-5 py-4 border-b border-border/50', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }) {
    return (
        <h3 className={clsx('font-display font-semibold text-lg text-text', className)}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className }) {
    return (
        <div className={clsx('p-5', className)}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className }) {
    return (
        <div className={clsx('px-5 py-4 border-t border-border/50 bg-dark-50/50 dark:bg-dark-900/50 rounded-b-2xl', className)}>
            {children}
        </div>
    );
}
