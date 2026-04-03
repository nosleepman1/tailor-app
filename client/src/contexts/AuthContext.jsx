import { createContext, useContext, useState, useEffect, useRef } from 'react'
import api from '@/api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialize from localStorage - only once
  const initRef = useRef(false)
  
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = !!token && !!user

  // ✅ Restore auth state from localStorage on mount
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
        
        // Inject token into axios
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        
        console.log('[Auth] Restored from localStorage:', userData?.name)
      } catch (e) {
        console.error('[Auth] Failed to restore:', e)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  // ✅ Keep token synced in axios headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  async function login(credentials) {
    setIsLoading(true)
    setError(null)
    try {
      const endpoint = credentials.isAdmin ? '/admin/login' : '/tailor/login'
      const { data } = await api.post(endpoint, {
        login: credentials.login,
        password_or_pin: credentials.password_or_pin
      })

      // Store in localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Update state
      setToken(data.token)
      setUser(data.user)

      console.log('[Auth] Login successful')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Connexion échouée'
      setError(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function register(userData) {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/tailor/register', userData)

      // Store in localStorage
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Update state
      setToken(data.token)
      setUser(data.user)

      console.log('[Auth] Register successful')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Inscription échouée'
      setError(msg)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await api.post('/logout')
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      // Clear localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')

      // Update state
      setToken(null)
      setUser(null)
      setIsLoading(false)

      console.log('[Auth] Logged out')
    }
  }

  function updateUser(updatedUser) {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
