import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Loader from '@/components/Loader'
import { AppLayout } from '@/components/layout/AppLayout'

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

function ProtectedRoute({ children, adminOnly = false }) {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === 'admin'

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

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
      <Suspense fallback={<Loader fullscreen />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Protected Area (AppLayout wraps the Sidebar/Navbar) */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/tailors" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute adminOnly><AdminEvents /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />

            {/* Client (tailleur) routes */}
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/clients" element={<ClientClients />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            
            <Route path="/events-orders" element={<EventsOrders />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/kanban" element={<KanbanBoard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
