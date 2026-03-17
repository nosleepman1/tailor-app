import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: '⬡' },
  { to: '/admin/users',     label: 'Utilisateurs',    icon: '◎' },
  { to: '/admin/clients',   label: 'Clients',         icon: '◈' },
]
const clientLinks = [
  { to: '/dashboard', label: 'Tableau de bord', icon: '⬡' },
  { to: '/clients',   label: 'Mes clients',     icon: '◈' },
]

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = isAdmin ? adminLinks : clientLinks

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const initials = user
    ? `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase()
    : '?'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-dark-900/95 backdrop-blur border-r border-dark-700/40 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-dark-700/40">
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Tailleur<span className="text-gold-400">Pro</span>
          </span>
          <p className="text-xs text-dark-400 mt-0.5">Gestion professionnelle</p>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                <span className="text-base opacity-70">{link.icon}</span>
                {link.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-dark-700/40">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-800/60">
            <div className="w-8 h-8 rounded-lg bg-primary-600/30 border border-primary-500/30 flex items-center justify-center text-xs font-bold text-primary-300">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-dark-100 truncate">{user?.firstname} {user?.lastname}</p>
              <span className={`text-[10px] ${isAdmin ? 'text-gold-400' : 'text-primary-400'}`}>
                {isAdmin ? 'Admin' : 'Tailleur'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-dark-400 hover:text-red-400 transition-colors p-1"
              title="Déconnexion"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-900/95 backdrop-blur border-t border-dark-700/40 z-30 px-2 py-2">
        <div className="flex items-center justify-around">
          {links.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active ? 'text-primary-300' : 'text-dark-400'
                }`}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                <span className="text-[10px]">{link.label.split(' ')[0]}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-dark-400 hover:text-red-400 transition-all"
          >
            <span className="text-lg leading-none">⏻</span>
            <span className="text-[10px]">Sortir</span>
          </button>
        </div>
      </nav>
    </>
  )
}
