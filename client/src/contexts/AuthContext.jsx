import { createContext, useContext, useState, useEffect } from 'react'
import authService from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === 'admin'

  async function login(email, password) {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(email, password)
      const { token: t, user: u } = data
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      return u
    } catch (err) {
      const msg = err.response?.data?.message || 'Identifiants incorrects'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    setLoading(true)
    await authService.logout()
    setToken(null)
    setUser(null)
    setLoading(false)
  }

  function updateUser(updatedUser) {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
