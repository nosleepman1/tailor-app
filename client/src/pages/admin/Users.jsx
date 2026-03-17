import { useState } from 'react'
import Layout from '@/components/Layout'
import ConfirmModal from '@/components/ConfirmModal'
import Loader from '@/components/Loader'
import { useUsers } from '@/hooks/useUsers'

const emptyUser = { firstname: '', lastname: '', username: '', email: '', password: '', role: 'client', is_active: true }

export default function AdminUsers() {
  const { data: users, loading, createUser, updateUser, deleteUser, toggleActive } = useUsers()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState(emptyUser)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return u.firstname?.toLowerCase().includes(q) || u.lastname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  function openCreate() { setForm(emptyUser); setEditUser(null); setErrors({}); setShowForm(true) }
  function openEdit(u)  { setForm({ ...u, password: '' }); setEditUser(u); setErrors({}); setShowForm(true) }
  function closeForm()  { setShowForm(false); setEditUser(null) }

  async function handleSave() {
    setSaving(true)
    setErrors({})
    try {
      if (editUser) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateUser(editUser.id, payload)
      } else {
        await createUser(form)
      }
      closeForm()
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: 'Une erreur est survenue' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout
      title="Utilisateurs"
      action={<button onClick={openCreate} className="btn-primary text-sm py-2 px-4">+ Ajouter</button>}
    >
      <div className="space-y-4 page-enter">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">⌕</span>
          <input type="text" className="input pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Count */}
        <p className="text-xs text-dark-500">{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''}</p>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16"><Loader size="lg" /></div>
        ) : (
          <div className="space-y-2">
            {filtered.map(u => (
              <div key={u.id} className="card p-4 flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-700 to-dark-800 border border-dark-600/50 flex items-center justify-center text-sm font-bold text-dark-300 shrink-0">
                  {(u.firstname?.[0] || '') + (u.lastname?.[0] || '')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-dark-100">{u.firstname} {u.lastname}</p>
                    <span className={u.role === 'admin' ? 'badge badge-gold' : 'badge badge-blue'}>{u.role}</span>
                    <span className={u.is_active ? 'badge badge-green' : 'badge badge-red'}>
                      {u.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400">{u.email}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleActive(u.id, !u.is_active)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${u.is_active ? 'text-emerald-400 hover:bg-emerald-600/10' : 'text-red-400 hover:bg-red-600/10'}`}
                    title={u.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {u.is_active ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={() => openEdit(u)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-primary-300 hover:bg-primary-600/10 text-xs transition-colors"
                  >✎</button>
                  <button
                    onClick={() => setToDelete(u.id)}
                    className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-600/10 text-xs transition-colors"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Form Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-dark-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-white">
                {editUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button onClick={closeForm} className="text-dark-400 hover:text-white p-1">✕</button>
            </div>

            {errors.general && (
              <div className="mb-4 bg-red-900/20 border border-red-700/30 text-red-300 text-sm px-3 py-2 rounded-lg">{errors.general}</div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Prénom</label>
                  <input className="input" value={form.firstname} onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Nom</label>
                  <input className="input" value={form.lastname} onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="label">Nom d'utilisateur</label>
                <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email[0]}</p>}
              </div>
              <div>
                <label className="label">Mot de passe {editUser && '(laisser vide pour ne pas changer)'}</label>
                <input type="password" className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Rôle</label>
                  <select className="input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="client">Tailleur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Statut</label>
                  <select className="input" value={form.is_active ? '1' : '0'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === '1' }))}>
                    <option value="1">Actif</option>
                    <option value="0">Inactif</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeForm} className="btn-ghost flex-1">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <><span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</> : '✓ Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Supprimer cet utilisateur ?"
        message="Cette action supprimera également tous ses clients associés."
        onConfirm={async () => { await deleteUser(toDelete); setToDelete(null) }}
        onCancel={() => setToDelete(null)}
        danger
      />
    </Layout>
  )
}
