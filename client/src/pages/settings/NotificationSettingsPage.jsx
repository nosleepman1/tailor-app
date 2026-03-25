import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import NotificationsSection from './NotificationsSection'

export default function NotificationSettingsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour aux paramètres
          </Link>
          <h1 className="text-3xl font-display font-bold text-text">Notifications</h1>
        </div>

        <div className="bg-bg-elevated border border-border rounded-xl shadow-sm p-6">
          <NotificationsSection />
        </div>
      </div>
    </div>
  )
}
