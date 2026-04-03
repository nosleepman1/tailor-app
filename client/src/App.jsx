import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import AppRouter from '@/routes/AppRouter'
import OfflineBanner from '@/components/OfflineBanner'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <OfflineBanner />
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  )
}
