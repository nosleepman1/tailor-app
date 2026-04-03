import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { User, Phone, Mail, Lock, Scissors, MapPin } from 'lucide-react'

export default function Register() {
  const { register, isLoading, error } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({ 
      name: '', email: '', phone: '', city: '', password: '' 
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const success = await register(form)
    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-bg bg-mesh-pattern flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-600/30 to-primary-800/30 border border-primary-500/30 flex items-center justify-center">
            <Scissors className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-text">
            Rejoindre<span className="text-gold-500">Pro</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Créez votre atelier digital</p>
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
                label="Nom complet de l'atelier"
                icon={User}
                placeholder="Atelier de Couture..."
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Téléphone"
                    icon={Phone}
                    placeholder="+221..."
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                  <Input
                    label="Ville (Optionnel)"
                    icon={MapPin}
                    placeholder="Dakar"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  />
              </div>

              <Input
                label="Email (Optionnel)"
                icon={Mail}
                type="email"
                placeholder="contact@atelier.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />

              <Input
                label="Mot de passe"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Créer mon compte
              </Button>
            </form>

            <p className="text-center text-sm text-text-muted mt-6">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                Connectez-vous
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
