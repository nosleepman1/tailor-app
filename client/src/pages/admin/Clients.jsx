import { useState } from 'react'
import Layout from '@/components/Layout'
import ClientCard from '@/components/ClientCard'
import Loader from '@/components/Loader'
import { useClients } from '@/hooks/useClients'

export default function AdminClients() {
  const { data: clients = [], isLoading: loading } = useClients()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    return (
      c.firstname?.toLowerCase().includes(q) ||
      c.lastname?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  })

  return (
    <Layout title="Tous les clients">
      <div className="space-y-4 page-enter">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">⌕</span>
          <input type="text" className="input pl-9" placeholder="Rechercher un client..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <p className="text-xs text-dark-500">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</p>

        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-4xl mb-3 opacity-20">◈</p>
            <p className="text-sm text-dark-400">Aucun client trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => <ClientCard key={c.id} client={c} showActions={false} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}
