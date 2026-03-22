import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import ClientDetail from '@/components/ClientDetail'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js'
import Layout from '@/components/Layout'
import StatCard from '@/components/StatCard'
import { useClients } from '@/hooks/useClients'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/Loader'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor: '#16163a', titleColor: '#a3a3ff', bodyColor: '#d3d3e8', borderColor: '#3a3a6e', borderWidth: 1 } },
  scales: {
    x: { grid: { color: '#16163a' }, ticks: { color: '#7a7aaa', font: { size: 10 } } },
    y: { grid: { color: '#16163a' }, ticks: { color: '#7a7aaa', font: { size: 10 } } },
  },
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const { data: clients, loading } = useClients()
  const [detailId, setDetailId] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    if (!clients.length) return
    const months = {}
    clients.forEach(c => {
      const d = new Date(c.created_at || Date.now())
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months[key] = (months[key] || 0) + 1
    })
    const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-6)
    setMonthlyData(sorted)
  }, [clients])

  const lineData = {
    labels: monthlyData.map(([k]) => k),
    datasets: [{
      data: monthlyData.map(([, v]) => v),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }]
  }

  const totalRevenue = clients.reduce((sum, c) => (c.is_paid && c.price ? sum + (Number(c.price) || 0) : sum), 0)
  const nonLivres = clients.filter(c => !c.livre).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <Layout
      title={`Bonjour, ${user?.firstname} ✦`}
      action={
        <Link to="/clients/new" className="btn-primary text-sm py-2 px-4">
          + Nouveau client
        </Link>
      }
    >
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" label="Chargement..." /></div>
      ) : (
        <div className="space-y-6 page-enter">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total clients" value={clients.length}  color="primary" />
            <StatCard label="Chiffre d'affaires (payé)" value={`${totalRevenue.toLocaleString('fr-FR')} F`}  color="gold" />
          </div>

         

          {/* Commandes non livrées — triées par ancienneté (plus urgent = plus ancien) */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--color-text-muted)]">Commandes à livrer ({nonLivres.length})</h2>
              <Link to="/clients" className="text-xs text-primary-400 hover:text-primary-300">Voir tout →</Link>
            </div>
            {nonLivres.length === 0 ? (
              <p className="text-sm text-[var(--color-text-subtle)] text-center py-8">
                {clients.length === 0 ? 'Aucun client pour l\'instant' : 'Toutes les commandes sont livrées ✓'}
              </p>
            ) : (
              <div className="space-y-2">
                {nonLivres.slice(0, 8).map((c, i) => (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailId(c.id)}
                    onKeyDown={e => e.key === 'Enter' && setDetailId(c.id)}
                    className="flex items-center gap-3 py-2 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-muted)] rounded-lg -mx-1 px-1 transition-colors cursor-pointer"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary-600/30 text-primary-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300 shrink-0">
                      {(c.firstname?.[0] || '') + (c.lastname?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text)] truncate">{c.firstname} {c.lastname}</p>
                      <p className="text-xs text-[var(--color-text-subtle)]">{c.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      {c.price && <span className="text-xs font-mono text-gold-400">{Number(c.price).toLocaleString()} F</span>}
                      {c.is_paid ? <span className="badge badge-green text-[10px]">Payé</span> : <span className="badge badge-red text-[10px]">Non payé</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <ClientDetail clientId={detailId} onClose={() => setDetailId(null)} />
    </Layout>
  )
}
