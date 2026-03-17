export default function Loader({ fullscreen = false, size = 'md', label = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-2 border-dark-600 border-t-primary-400 rounded-full animate-spin`} />
      {label && <p className="text-xs text-dark-400 animate-pulse">{label}</p>}
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-2 border-dark-700 border-t-primary-400 rounded-full animate-spin" />
          <p className="font-display text-xl text-dark-300">TailleurPro</p>
        </div>
      </div>
    )
  }

  return spinner
}
