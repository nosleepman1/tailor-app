import { useEffect, useState } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
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

  const totalRevenue = clients.reduce((sum, c) => sum + (Number(c.price) || 0), 0)
  const activeClients = clients.filter(c => !c._offline).length

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
            <StatCard label="Total clients"   value={clients.length}  icon="◈" color="primary" />
            <StatCard label="Chiffre d'affaires" value={`${totalRevenue.toLocaleString('fr-FR')} F`} icon="◎" color="gold" />
          </div>

          {/* Line chart */}
          <div className="card p-4">
            <h2 className="text-sm font-medium text-dark-300 mb-4">Clients par mois</h2>
            <div className="h-40">
              {monthlyData.length > 0 ? (
                <Line data={lineData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-dark-500 text-sm">
                  Pas encore de données
                </div>
              )}
            </div>
          </div>

          {/* Recent clients */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-dark-300">Derniers clients</h2>
              <Link to="/clients" className="text-xs text-primary-400 hover:text-primary-300">Voir tout →</Link>
            </div>
            {clients.length === 0 ? (
              <p className="text-sm text-dark-500 text-center py-8">Aucun client pour l'instant</p>
            ) : (
              <div className="space-y-2">
                {clients.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center gap-3 py-2 border-b border-dark-700/30 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-300">
                      {(c.firstname?.[0] || '') + (c.lastname?.[0] || '')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-dark-200">{c.firstname} {c.lastname}</p>
                      <p className="text-xs text-dark-500">{c.phone}</p>
                    </div>
                    {c.price && <span className="text-xs font-mono text-gold-400">{Number(c.price).toLocaleString()} F</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
