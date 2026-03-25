import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/contexts/ThemeContext'
import LogoutButton from '@/pages/settings/LogoutButton'
import { User, ShieldCheck, Bell, ChevronRight, Moon } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const menuItems = [
    {
      id: 'profile',
      label: 'Profil & Sécurité',
      description: 'Gérez vos informations personnelles et votre mot de passe.',
      icon: <User className="w-6 h-6 text-text-subtle" />,
      path: '/settings/profile',
    },
    {
      id: 'subscription',
      label: 'Abonnement',
      description: 'Consultez et modifiez les détails de votre forfait actuel.',
      icon: <ShieldCheck className="w-6 h-6 text-text-subtle" />,
      path: '/settings/subscription',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Contrôlez vos préférences d\'alertes PWA et emails.',
      icon: <Bell className="w-6 h-6 text-text-subtle" />,
      path: '/settings/notifications',
    },
  ]

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text">Paramètres</h1>
          <p className="mt-2 text-text-muted">
            Gérez votre compte et vos préférences
          </p>
        </div>

        <div className="bg-bg-elevated border border-border rounded-xl shadow-sm overflow-hidden mb-6">
          <ul className="divide-y divide-border">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link to={item.path} className="block hover:bg-dark-50 transition-colors">
                  <div className="flex items-center px-6 py-5">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-base font-medium text-text">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        {item.description}
                      </p>
                    </div>
                    <div>
                      <ChevronRight className="w-5 h-5 text-text-subtle" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            
            {/* Theme Toggle Button */}
            <li>
              <div className="flex items-center justify-between px-6 py-5 hover:bg-dark-50 transition-colors cursor-pointer" onClick={toggleTheme}>
                <div className="flex items-center">
                  <Moon className="w-6 h-6 text-text-subtle" />
                  <div className="ml-4">
                    <p className="text-base font-medium text-text">
                      Mode Sombre
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      Basculez entre le thème clair et sombre de l'interface.
                    </p>
                  </div>
                </div>
                <div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-border'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div className="bg-bg-elevated border border-border rounded-xl shadow-sm p-4 text-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}