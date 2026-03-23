import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(({ 
    label, 
    error, 
    icon: Icon,
    className, 
    containerClassName,
    ...props 
}, ref) => {
    return (
        <div className={clsx('flex flex-col gap-1.5 w-full min-w-0 max-w-full', containerClassName)}>
            {label && (
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {label}
                </label>
            )}
            <div className="relative w-full min-w-0 max-w-full">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full max-w-full truncate bg-bg-elevated border border-border text-text text-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:opacity-60 disabled:bg-bg-muted',
                        Icon ? 'pl-9 pr-4 py-2.5' : 'px-4 py-2.5',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-500 font-medium animate-slide-up">
                    {error}
                </span>
            )}
        </div>
    );
});
Input.displayName = 'Input';
