import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Mail, Phone, Lock, Scissors } from 'lucide-react'

export default function Login() {
  const { login, isLoading, error, user } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ login: '', password_or_pin: '' })
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const success = await login({ ...form, isAdmin: isAdminLogin })
    if (success) {
      // Let the router handle the redirect based on user role
      navigate(isAdminLogin ? '/admin/dashboard' : '/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-bg bg-mesh-pattern flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/30 flex items-center justify-center">
            <Scissors className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-text">
            Tailleur<span className="text-gold-500">Pro</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Connectez-vous à votre espace</p>
        </div>

        <Card>
          <CardContent>
            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Téléphone ou E-mail"
                icon={Mail}
                placeholder="vous@example.com ou +221..."
                value={form.login}
                onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                required
              />

              <div className="relative">
                <Input
                  label="Mot de passe ou PIN"
                  icon={Lock}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password_or_pin}
                  onChange={e => setForm(f => ({ ...f, password_or_pin: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-[34px] text-text-subtle hover:text-text text-xs font-semibold"
                >
                  {showPass ? 'Cacher' : 'Voir'}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="adminLogin" 
                  checked={isAdminLogin} 
                  onChange={(e) => setIsAdminLogin(e.target.checked)}
                  className="rounded border-border text-primary-600 focus:ring-primary-500/30 bg-bg-muted" 
                />
                <label htmlFor="adminLogin" className="text-sm text-text-muted cursor-pointer">
                  Je suis un administrateur
                </label>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-4"
              >
                Se connecter
              </Button>
            </form>

            {!isAdminLogin && (
              <p className="text-center text-sm text-text-muted mt-6">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                  Inscrivez-vous
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
