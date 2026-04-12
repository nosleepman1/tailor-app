import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2'

const api = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    },
    timeout: 15000,
    withCredentials: false, // On utilise Bearer token, pas les cookies de session
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ✅ Intercepteur de réponse — log complet des erreurs serveur
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url = error.config?.url

        if (status === 401) {
            console.warn(`[API] 401 Unauthorized → ${url}`)
            // Ne pas rediriger ici — laisser ProtectedRoute le gérer
        } else if (status >= 500) {
            // ⚠️ Log complet du corps de la réponse pour déboguer les 500
            console.error(`[API] ${status} Server Error → ${url}`)
            console.error('[API] Response body:', error.response?.data)
            console.error('[API] Headers sent:', error.config?.headers)
        } else if (status === 422) {
            console.warn(`[API] 422 Validation Error → ${url}`, error.response?.data?.errors)
        } else if (status === 404) {
            console.warn(`[API] 404 Not Found → ${url}`)
        }

        return Promise.reject(error)
    }
)

export default api
