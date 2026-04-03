import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useClients, useUpdateClientStatus } from '@/hooks/useClients'
import { getStorageUrl } from '@/utils/storageUrl'

export default function ClientDetail({ clientId, onClose, onDelete }) {
  const { data: clients = [] } = useClients()
  const updateClientStatusMutation = useUpdateClientStatus()
  const client = clients?.find((c) => c.id === clientId)

  useEffect(() => {
    if (clientId) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [clientId])

  if (!clientId || !client) return null

  const initials = `${client.firstname?.[0] || ''}${client.lastname?.[0] || ''}`.toUpperCase()
  const measures = client.mesures || {}
  const measureKeys = Object.keys(measures).filter((k) => measures[k])
  const modelImg = getStorageUrl(client.model_image)
  const tissusImg = getStorageUrl(client.tissus_image)

  async function togglePaid() {
    if (!client.price) return
    await updateClientStatusMutation.mutateAsync({ id: client.id, payload: { is_paid: !client.is_paid } })
  }

  async function toggleLivre() {
    await updateClientStatusMutation.mutateAsync({ id: client.id, payload: { livre: !client.livre } })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[6px] transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-bg-elevated shadow-2xl flex flex-col animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 dark:border-white/5 shrink-0">
          <h2 className="font-display text-base font-semibold text-[var(--color-text)]">Fiche client</h2>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 rounded-lg hover:bg-[var(--color-bg-muted)]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-700/40 to-primary-900/40 border border-primary-500/20 flex items-center justify-center text-lg font-bold text-primary-300 shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="font-medium text-[var(--color-text)] text-base">
                {client.firstname} {client.lastname}
              </h3>
              {client.phone && (
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{client.phone}</p>
              )}
              {client.price && (
                <p className="text-sm text-gold-400 font-mono font-medium mt-1">
                  {Number(client.price).toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>
          </div>

          {/* Statuts Payement & Livré */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={togglePaid}
              disabled={!client.price}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                client.is_paid
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-emerald-500/30'
              } ${!client.price ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={client.price ? (client.is_paid ? 'Payé — cliquer pour annuler' : 'Non payé — cliquer pour marquer payé') : 'Définir un prix d\'abord'}
            >
              {client.is_paid ? '✓ Payé' : '○ Non payé'}
            </button>
            <button
              onClick={toggleLivre}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                client.livre
                  ? 'bg-primary-500/20 text-primary-500 border border-primary-500/30'
                  : 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-primary-500/30'
              }`}
              title={client.livre ? 'Livré — cliquer pour annuler' : 'Non livré — cliquer pour marquer livré'}
            >
              {client.livre ? '✓ Livré' : '○ En cours'}
            </button>
          </div>

          {/* Images Modèle & Tissu */}
          <div>
            <p className="label mb-3">Photos</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-muted)] aspect-square">
                {modelImg ? (
                  <img src={`${modelImg}`} alt="Modèle" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-subtle)] text-xs p-2">
                    <span className="text-2xl opacity-30">✦</span>
                    <span>Modèle</span>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-bg-muted)] aspect-square">
                {tissusImg ? (
                  <img src={tissusImg} alt="Tissu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-subtle)] text-xs p-2">
                    <span className="text-2xl opacity-30">◇</span>
                    <span>Tissu</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Modifier mesures */}
          <Link
            to={`/clients/${client.id}/edit`}
            onClick={onClose}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2"
          >
            ✎ Modifier mesures & infos
          </Link>

          {/* Mesures */}
          {measureKeys.length > 0 && (
            <div>
              <p className="label mb-3">Mesures</p>
              <div className="grid grid-cols-3 gap-2">
                {measureKeys.map((key) => (
                  <div key={key} className="card p-3 text-center">
                    <p className="text-[10px] text-[var(--color-text-subtle)] uppercase tracking-wide">{key}</p>
                    <p className="text-sm font-mono text-[var(--color-text-muted)] mt-1">{measures[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {client.notes && (
            <div>
              <p className="label mb-2">Notes</p>
              <p className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] rounded-xl px-4 py-3 border border-[var(--color-border)] leading-relaxed">
                {client.notes}
              </p>
            </div>
          )}

          {client._offline && (
            <span className="badge badge-gold">Créé hors ligne — synchronisation en attente</span>
          )}
        </div>

        {onDelete && (
          <div className="px-5 py-4 border-t border-[var(--color-border)] shrink-0">
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
