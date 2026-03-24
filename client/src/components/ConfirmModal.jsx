export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/45 backdrop-blur-[6px] transition-opacity duration-200" onClick={onCancel}>
      <div className="card w-full max-w-sm p-6 rounded-[20px] shadow-xl bg-bg-elevated animate-modal-in" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold text-text mb-2">{title}</h3>
        {message && <p className="text-sm text-text-muted mb-6">{message}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="btn-ghost flex-1">Annuler</button>
          <button
            onClick={onConfirm}
            className={`flex-1 flex justify-center items-center py-2.5 rounded-xl font-medium transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm' : 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
