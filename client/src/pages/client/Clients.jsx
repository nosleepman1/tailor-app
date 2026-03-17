import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import ClientCard from '@/components/ClientCard'
import ClientDetail from '@/components/ClientDetail'
import ConfirmModal from '@/components/ConfirmModal'
import EmptyState from '@/components/EmptyState'
import Pagination from '@/components/Pagination'
import { SkeletonList } from '@/components/SkeletonCard'
import { useClients } from '@/hooks/useClients'
import { useDebounce } from '@/hooks/useDebounce'
import { useToast } from '@/contexts/ToastContext'

const PER_PAGE = 10

export default function ClientClients() {
  const { data: clients, loading, error, deleteClient } = useClients()
  const toast = useToast()

  const [search, setSearch]     = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [page, setPage]         = useState(1)

  const debouncedSearch = useDebounce(search, 250)

  const filtered = clients.filter(c => {
    const q = debouncedSearch.toLowerCase()
    return (
      c.firstname?.toLowerCase().includes(q) ||
      c.lastname?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleSearch(val) { setSearch(val); setPage(1) }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteClient(toDelete)
      toast.success('Client supprimé avec succès')
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setToDelete(null)
    }
  }

  return (
    <Layout
      title="Mes clients"
      action={
        <Link to="/clients/new" className="btn-primary text-sm py-2 px-4">+ Ajouter</Link>
      }
    >
      <div className="space-y-4 page-enter">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">⌕</span>
          <input
            type="text"
            className="input pl-9"
            placeholder="Rechercher par nom, téléphone..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white text-xs">✕</button>
          )}
        </div>

        {!loading && (
          <p className="text-xs text-dark-500">
            {filtered.length} client{filtered.length !== 1 ? 's' : ''}
            {debouncedSearch ? ` pour "${debouncedSearch}"` : ''}
          </p>
        )}

        {loading ? (
          <SkeletonList count={5} />
        ) : error ? (
          <div className="card p-6 text-center text-red-400 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="◈"
            title={debouncedSearch ? 'Aucun résultat' : 'Aucun client ajouté'}
            description={debouncedSearch ? `Aucun client ne correspond à "${debouncedSearch}"` : 'Commencez par ajouter votre premier client'}
            action={!debouncedSearch && (
              <Link to="/clients/new" className="btn-primary text-sm">Ajouter un client</Link>
            )}
          />
        ) : (
          <>
            <div className="space-y-3">
              {paginated.map(client => (
                <div key={client.id} onClick={() => setDetailId(client.id)} className="cursor-pointer">
                  <ClientCard client={client} onDelete={id => setToDelete(id)} />
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ClientDetail clientId={detailId} onClose={() => setDetailId(null)} onDelete={id => setToDelete(id)} />

      <ConfirmModal
        open={!!toDelete}
        title="Supprimer ce client ?"
        message="Cette action est irréversible. Toutes les mesures associées seront perdues."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        danger
      />
    </Layout>
  )
}
