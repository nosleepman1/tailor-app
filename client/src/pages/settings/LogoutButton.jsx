import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
      toast.success('Déconnexion réussie')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium text-left"
    >
      <LogOut size={20} />
      <span>Déconnexion</span>
    </button>
  )
}
