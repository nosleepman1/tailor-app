import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2'

const api = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
    },
    timeout: 15000,
    withCredentials: true,
})

// ✅ Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log 401 errors for debugging
        if (error.response?.status === 401) {
            console.warn('[API] 401 Unauthorized - Let routes handle redirect')
            // DON'T redirect here - let AppRouter handle it via ProtectedRoute
            // This keeps the context state consistent
        } else if (error.response?.status >= 500) {
            console.error('[API] Server error:', error.response?.status)
        }
        
        return Promise.reject(error)
    }
)

export default api

