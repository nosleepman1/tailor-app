import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Loader from '@/components/Loader'

// Lazy pages
const Login            = lazy(() => import('@/pages/Login'))
const AdminDashboard   = lazy(() => import('@/pages/admin/Dashboard'))
const AdminUsers       = lazy(() => import('@/pages/admin/Users'))
const AdminClients     = lazy(() => import('@/pages/admin/Clients'))
const ClientDashboard  = lazy(() => import('@/pages/client/Dashboard'))
const ClientClients    = lazy(() => import('@/pages/client/Clients'))
const ClientForm       = lazy(() => import('@/pages/client/ClientForm'))

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function RoleRedirect() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/dashboard'} replace />
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullscreen />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute adminOnly>
              <AdminClients />
            </ProtectedRoute>
          } />

          {/* Client (tailleur) routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientClients />
            </ProtectedRoute>
          } />
          <Route path="/clients/new" element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id/edit" element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
