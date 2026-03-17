import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true })
    } catch (_) {}
  }

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-pattern flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/30 flex items-center justify-center">
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Tailleur<span className="text-gold-400">Pro</span>
          </h1>
          <p className="text-sm text-dark-400 mt-1">Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          {error && (
            <div className="mb-4 bg-red-900/20 border border-red-700/30 text-red-300 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Adresse e-mail</label>
              <input
                type="email"
                className="input"
                placeholder="vous@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 text-xs"
                >
                  {showPass ? 'Cacher' : 'Voir'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-dark-500 mt-6">
          © {new Date().getFullYear()} TailleurPro
        </p>
      </div>
    </div>
  )
}
