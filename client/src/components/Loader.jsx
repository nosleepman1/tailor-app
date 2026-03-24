export default function Loader({ fullscreen = false, size = 'md', label = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-2 border-[var(--color-border)] border-t-primary-500 rounded-full animate-spin`} />
      {label && <p className="text-xs text-[var(--color-text-muted)] animate-pulse">{label}</p>}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[var(--color-bg)] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-[var(--color-border)] border-t-primary-500 rounded-full animate-spin" />
          <p className="font-display text-xl text-[var(--color-text-muted)]">TailleurPro</p>
        </div>
      </div>
    )
  }

  return spinner
}
