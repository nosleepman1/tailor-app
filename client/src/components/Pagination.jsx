/**
 * Pagination — simple prev/next + page indicator.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-ghost px-3 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Préc.
      </button>

      <span className="text-xs text-dark-400">
        Page {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-ghost px-3 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Suiv. →
      </button>
    </div>
  )
}
