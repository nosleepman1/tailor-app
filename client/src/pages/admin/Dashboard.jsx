import { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js'
import Layout from '@/components/Layout'
import StatCard from '@/components/StatCard'
import Loader from '@/components/Loader'
import { useUsers } from '@/hooks/useUsers'
import { useClients } from '@/hooks/useClients'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const chartColors = { bg: '#16163a', grid: '#1e1e3e', text: '#7a7aaa' }

export default function AdminDashboard() {
  const { data: users, loading: loadingUsers } = useUsers()
  const { data: clients, loading: loadingClients } = useClients()

  const activeUsers   = users.filter(u => u.is_active).length
  const inactiveUsers = users.filter(u => !u.is_active).length
  const admins        = users.filter(u => u.role === 'admin').length
  const tailors       = users.filter(u => u.role === 'client').length

  // Clients grouped by tailor (user_id)
  const clientsByTailor = users
    .filter(u => u.role === 'client')
    .map(u => ({ name: `${u.firstname} ${u.lastname}`, count: clients.filter(c => c.user_id === u.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const barData = {
    labels: clientsByTailor.map(t => t.name),
    datasets: [{
      label: 'Clients',
      data: clientsByTailor.map(t => t.count),
      backgroundColor: 'rgba(99,102,241,0.5)',
      borderColor: '#6366f1',
      borderWidth: 1,
      borderRadius: 6,
    }]
  }

  const donutData = {
    labels: ['Actifs', 'Inactifs'],
    datasets: [{
      data: [activeUsers, inactiveUsers],
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(239,68,68,0.4)'],
      borderColor: ['#6366f1', '#ef4444'],
      borderWidth: 1,
    }]
  }

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: chartColors.bg, titleColor: '#a3a3ff', bodyColor: '#d3d3e8', borderColor: '#3a3a6e', borderWidth: 1 } },
    scales: {
      x: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { size: 10 }, maxRotation: 30 } },
      y: { grid: { color: chartColors.grid }, ticks: { color: chartColors.text, font: { size: 10 } } },
    }
  }

  const donutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: chartColors.text, font: { size: 11 } } }, tooltip: { backgroundColor: chartColors.bg, titleColor: '#a3a3ff', bodyColor: '#d3d3e8', borderColor: '#3a3a6e', borderWidth: 1 } },
  }

  const loading = loadingUsers || loadingClients

  return (
    <Layout title="Administration ✦">
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" label="Chargement..." /></div>
      ) : (
        <div className="space-y-6 page-enter">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Utilisateurs" value={users.length}   icon="◎" color="primary" />
            <StatCard label="Tailleurs"    value={tailors}         icon="◈" color="gold"    />
            <StatCard label="Clients total" value={clients.length} icon="✦" color="green"   />
            <StatCard label="Comptes inactifs" value={inactiveUsers} icon="⊘" color="red"   />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 card p-4">
              <h2 className="text-sm font-medium text-dark-300 mb-4">Clients par tailleur</h2>
              <div className="h-44">
                {clientsByTailor.length > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-dark-500 text-sm">Aucune donnée</div>
                )}
              </div>
            </div>

            <div className="card p-4">
              <h2 className="text-sm font-medium text-dark-300 mb-4">Statut comptes</h2>
              <div className="h-44">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>
          </div>

          {/* Recent users table */}
          <div className="card p-4">
            <h2 className="text-sm font-medium text-dark-300 mb-4">Derniers utilisateurs</h2>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-dark-700/30">
                    {['Nom', 'Email', 'Rôle', 'Statut'].map(h => (
                      <th key={h} className="pb-3 text-xs text-dark-500 font-medium pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/20">
                  {users.slice(0, 5).map(u => (
                    <tr key={u.id} className="hover:bg-dark-800/30 transition-colors">
                      <td className="py-3 pr-4 text-dark-200">{u.firstname} {u.lastname}</td>
                      <td className="py-3 pr-4 text-dark-400 text-xs">{u.email}</td>
                      <td className="py-3 pr-4">
                        <span className={u.role === 'admin' ? 'badge badge-gold' : 'badge badge-blue'}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={u.is_active ? 'badge badge-green' : 'badge badge-red'}>
                          {u.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
