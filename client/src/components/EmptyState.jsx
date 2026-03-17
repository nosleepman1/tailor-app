export default function EmptyState({ icon = '◈', title, description, action }) {
  return (
    <div className="card p-12 text-center flex flex-col items-center gap-3">
      <span className="text-5xl opacity-20 select-none">{icon}</span>
      {title && <p className="text-sm font-medium text-dark-200">{title}</p>}
      {description && <p className="text-xs text-dark-400 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
