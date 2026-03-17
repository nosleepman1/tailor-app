export default function StatCard({ label, value, icon, trend, color = 'primary' }) {
  const colors = {
    primary: 'from-primary-700/20 to-primary-900/10 border-primary-500/20 text-primary-300',
    gold:    'from-gold-700/20 to-gold-900/10 border-gold-500/20 text-gold-300',
    green:   'from-emerald-700/20 to-emerald-900/10 border-emerald-500/20 text-emerald-300',
    red:     'from-red-700/20 to-red-900/10 border-red-500/20 text-red-300',
  }

  return (
    <div className={`card p-4 bg-gradient-to-br ${colors[color]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-dark-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold mt-1 text-white font-mono">{value ?? '—'}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <span className="text-2xl opacity-40">{icon}</span>
        )}
      </div>
    </div>
  )
}
