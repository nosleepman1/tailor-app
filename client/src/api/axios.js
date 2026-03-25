import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v2',
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
    timeout: 15000,
})

// Inject Bearer token on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 403 &&
            error.response?.data?.code === 'SUBSCRIPTION_REQUIRED'
        ) {
            window.location.href = '/subscription?expired=true'
        } else if (error.response?.status === 401) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
