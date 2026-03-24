import { AlertCircle } from 'lucide-react';

export default function AlertBanner({ message, type = 'warning' }) {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl mb-6 font-medium text-sm border";
    
    const types = {
        warning: "bg-gold-500/10 text-gold-600 border-gold-500/20",
        error: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        success: "bg-green-500/10 text-green-600 border-green-500/20"
    };

    return (
        <div className={`${baseClasses} ${types[type]}`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{message}</p>
        </div>
    );
}
