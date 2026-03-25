import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import { AppLayout } from '@/components/layout/AppLayout'
import SubscriptionGuard from '@/components/SubscriptionGuard'
import { SubscriptionProvider } from '@/context/SubscriptionContext'

// Lazy pages
const Login            = lazy(() => import('@/pages/Login'))
const Register         = lazy(() => import('@/pages/Register'))
const AdminDashboard   = lazy(() => import('@/pages/admin/Dashboard'))
const AdminUsers       = lazy(() => import('@/pages/admin/Users'))
const AdminEvents      = lazy(() => import('@/pages/admin/Events'))
const AdminOrders      = lazy(() => import('@/pages/admin/Orders'))
const ClientDashboard  = lazy(() => import('@/pages/client/Dashboard'))
const ClientClients    = lazy(() => import('@/pages/client/Clients'))
const ClientForm       = lazy(() => import('@/pages/client/ClientForm'))
const EventsOrders     = lazy(() => import('@/pages/client/EventsOrders'))
const OrderForm        = lazy(() => import('@/pages/client/OrderForm'))
const OrderDetail      = lazy(() => import('@/pages/client/OrderDetail'))
const KanbanBoard      = lazy(() => import('@/pages/client/KanbanBoard'))
const SettingsPage     = lazy(() => import('@/pages/SettingsPage'))
const ProfileSettingsPage     = lazy(() => import('@/pages/settings/ProfileSettingsPage'))
const SubscriptionSettingsPage     = lazy(() => import('@/pages/settings/SubscriptionSettingsPage'))
const NotificationSettingsPage     = lazy(() => import('@/pages/settings/NotificationSettingsPage'))

// DexPay Subscription Pages
const SubscriptionPage        = lazy(() => import('@/pages/SubscriptionPage'))
const SubscriptionSuccessPage = lazy(() => import('@/pages/SubscriptionSuccessPage'))
const SubscriptionFailurePage = lazy(() => import('@/pages/SubscriptionFailurePage'))

function RoleRedirect() {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === 'admin'

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SubscriptionProvider>
        <Suspense fallback={<Loader fullscreen />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RoleRedirect />} />

            {/* Subscription Routes */}
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
            <Route path="/subscription/failure" element={<SubscriptionFailurePage />} />

            {/* Protected Area (AppLayout wraps the Sidebar/Navbar) */}
            <Route element={<SubscriptionGuard><AppLayout /></SubscriptionGuard>}>
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<SubscriptionGuard adminOnly><AdminDashboard /></SubscriptionGuard>} />
              <Route path="/admin/tailors" element={<SubscriptionGuard adminOnly><AdminUsers /></SubscriptionGuard>} />
              <Route path="/admin/events" element={<SubscriptionGuard adminOnly><AdminEvents /></SubscriptionGuard>} />
              <Route path="/admin/orders" element={<SubscriptionGuard adminOnly><AdminOrders /></SubscriptionGuard>} />

              {/* Client (tailleur) routes */}
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/clients" element={<ClientClients />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id/edit" element={<ClientForm />} />
              
              <Route path="/events-orders" element={<EventsOrders />} />
              <Route path="/orders/new" element={<OrderForm />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/profile" element={<ProfileSettingsPage />} />
              <Route path="/settings/subscription" element={<SubscriptionSettingsPage />} />
              <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SubscriptionProvider>
    </BrowserRouter>
  )
}
