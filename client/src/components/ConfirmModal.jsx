export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-dark-950/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-sm p-6 animate-slide-up">
        <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
        {message && <p className="text-sm text-dark-300 mb-6">{message}</p>}
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">Annuler</button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
