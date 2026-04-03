import { create } from 'zustand';
import api from '../api/axios';

// ✅ Initialize auth from localStorage if exists
let initAuthHasRun = false;

export const useAuthStore = create((set, get) => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('auth_token'),

    // ✅ Initialize auth on app mount (check if session exists via cookies)
    initAuth: async () => {
        // Prevent running more than once
        if (initAuthHasRun) {
            console.log('[Auth] initAuth already ran, skipping');
            return;
        }
        
        // If we already have a token in localStorage, skip the /me call
        const token = localStorage.getItem('auth_token');
        if (token) {
            console.log('[Auth] Token found in localStorage, skipping /me check');
            initAuthHasRun = true;
            return;
        }
        
        try {
            initAuthHasRun = true;
            console.log('[Auth] Starting initAuth to check session...');
            
            // Try to get current user (validates session via cookies)
            const { data } = await api.get('/me');
            
            console.log('[Auth] Got user from /me:', data);
            
            set({ 
                user: data, 
                isAuthenticated: true,
                isLoading: false 
            });
            
            // Store in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.log('[Auth] No valid session - user must login');
            set({ 
                user: null, 
                isAuthenticated: false,
                isLoading: false 
            });
        }
    },

    // ✅ Login with token stored in localStorage
    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const endpoint = credentials.isAdmin ? '/admin/login' : '/tailor/login';
            const { data } = await api.post(endpoint, {
                login: credentials.login,
                password_or_pin: credentials.password_or_pin
            });
            
            // ✅ Store token and user in localStorage
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('[Auth] Login successful, token stored');
            
            set({ 
                user: data.user, 
                isAuthenticated: true,
                isLoading: false 
            });

            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Connexion échouée';
            set({ 
                error: msg, 
                isLoading: false,
                isAuthenticated: false 
            });
            return false;
        }
    },

    // ✅ Register with token stored in localStorage
    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/tailor/register', userData);
            
            // ✅ Store token and user in localStorage
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            console.log('[Auth] Registration successful');
            
            set({ 
                user: data.user, 
                isAuthenticated: true,
                isLoading: false 
            });

            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Inscription échouée';
            set({ 
                error: msg, 
                isLoading: false,
                isAuthenticated: false 
            });
            return false;
        }
    },

    // ✅ Logout - clear localStorage
    logout: async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error('[Auth] Logout error:', e);
        } finally {
            // Clear localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            
            set({ 
                user: null, 
                isAuthenticated: false 
            });
            
            console.log('[Auth] Logged out');
        }
    },

    // ✅ Update user profile
    updateUser: (userData) => {
        const updated = { ...get().user, ...userData };
        set(state => ({
            user: updated
        }));
        localStorage.setItem('user', JSON.stringify(updated));
    },
}));

// ✅ Setup interceptor to inject token from localStorage (only once)
let interceptorSetup = false;
export function setupAuthInterceptor() {
    if (interceptorSetup) return; // Prevent duplicate interceptors
    interceptorSetup = true;
    
    // Token is already injected by axios.js request interceptor
    console.log('[Auth] Interceptor setup complete');
}
