import { Link } from 'react-router-dom'

export default function ClientCard({ client, onDelete, showActions = true }) {
  const initials = `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase()

  return (
    <div className="card p-4 hover:border-[var(--color-border)] transition-all duration-200 group">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-700/40 to-primary-900/40 border border-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-300 shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-[var(--color-text)] text-sm truncate">
              {client.firstname} {client.lastname}
            </h3>
            {client._offline && <span className="badge badge-gold">hors ligne</span>}
            {client.livre && <span className="badge badge-green">livré</span>}
            {client.is_paid && !client.livre && <span className="badge badge-blue">payé</span>}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{client.phone || '—'}</p>
          {client.price && (
            <p className="text-xs text-gold-400 mt-1 font-mono font-medium">
              {Number(client.price).toLocaleString('fr-FR')} FCFA
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={`/clients/${client.id}/edit`}
              className="p-1.5 rounded-lg bg-[var(--color-bg-muted)] hover:bg-primary-600/20 text-[var(--color-text-muted)] hover:text-primary-600 dark:hover:text-primary-300 transition-colors text-xs"
              title="Modifier"
            >
              ✎
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(client.id)}
                className="p-1.5 rounded-lg bg-[var(--color-bg-muted)] hover:bg-red-600/20 text-[var(--color-text-muted)] hover:text-red-500 transition-colors text-xs"
                title="Supprimer"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Measures preview */}
      {client.mesures && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)] grid grid-cols-3 gap-2">
          {['epaule', 'taille', 'poitrine'].map(key => (
            client.mesures[key] ? (
              <div key={key} className="text-center">
                <p className="text-[10px] text-[var(--color-text-subtle)] uppercase">{key}</p>
                <p className="text-xs font-mono text-[var(--color-text-muted)]">{client.mesures[key]}</p>
              </div>
            ) : null
          ))}
        </div>
      )}
    </div>
  )
}
