import { useEffect, useState } from 'react'
import { useClients } from '@/hooks/useClients'

/**
 * ClientDetail — slide-in panel showing full client info.
 * Controlled by `clientId` (null = closed).
 */
export default function ClientDetail({ clientId, onClose, onDelete }) {
  const { data: clients } = useClients()
  const client = clients.find((c) => c.id === clientId)

  // lock body scroll while open
  useEffect(() => {
    if (clientId) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [clientId])

  if (!clientId || !client) return null

  const initials = `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase()

  const measures = client.mesures || {}
  const measureKeys = Object.keys(measures).filter((k) => measures[k])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-dark-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-dark-900 border-l border-dark-700/50 shadow-2xl flex flex-col animate-slide-up overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/30 shrink-0">
          <h2 className="font-display text-base font-semibold text-white">Fiche client</h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700/50"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-6 space-y-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-700/40 to-primary-900/40 border border-primary-500/20 flex items-center justify-center text-lg font-bold text-primary-300 shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="font-medium text-white text-base">
                {client.firstname} {client.lastname}
              </h3>
              {client.phone && (
                <p className="text-sm text-dark-400 mt-0.5">{client.phone}</p>
              )}
              {client.price && (
                <p className="text-sm text-gold-400 font-mono font-medium mt-1">
                  {Number(client.price).toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>
          </div>

          {/* Measures */}
          {measureKeys.length > 0 && (
            <div>
              <p className="label mb-3">Mesures</p>
              <div className="grid grid-cols-3 gap-2">
                {measureKeys.map((key) => (
                  <div key={key} className="card p-3 text-center">
                    <p className="text-[10px] text-dark-500 uppercase tracking-wide">{key}</p>
                    <p className="text-sm font-mono text-dark-200 mt-1">{measures[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div>
              <p className="label mb-2">Notes</p>
              <p className="text-sm text-dark-300 bg-dark-800/60 rounded-xl px-4 py-3 border border-dark-700/30 leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}

          {client._offline && (
            <span className="badge badge-gold">Créé hors ligne — synchronisation en attente</span>
          )}
        </div>

        {/* Footer actions */}
        {onDelete && (
          <div className="px-5 py-4 border-t border-dark-700/30 shrink-0">
            <button
              onClick={() => { onDelete(client.id); onClose() }}
              className="btn-danger w-full text-sm"
            >
              Supprimer ce client
            </button>
          </div>
        )}
      </div>
    </>
  )
}
