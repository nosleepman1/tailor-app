import React from 'react';
import clsx from 'clsx';

export function StatusBadge({ status, className }) {
    const statusConfig = {
        pending: { label: 'En attente', colorClass: 'badge-gold' },
        in_progress: { label: 'En cours', colorClass: 'badge-blue' },
        ready: { label: 'Prêt', colorClass: 'badge-green' },
        delivered: { label: 'Livré', colorClass: 'badge-green' },
        cancelled: { label: 'Annulé', colorClass: 'badge-red' },
    };

    const config = statusConfig[status] || { label: status, colorClass: 'badge-gold' };

    return (
        <span className={clsx('badge', config.colorClass, className)}>
            {config.label}
        </span>
    );
}
