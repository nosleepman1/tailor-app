import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const endpoint = credentials.isAdmin ? '/admin/login' : '/tailor/login';
            const { data } = await api.post(endpoint, {
                login: credentials.login,
                password_or_pin: credentials.password_or_pin
            });
            
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            set({ user: data.user, token: data.token, isLoading: false });
            return true;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Login failed', 
                isLoading: false 
            });
            return false;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/tailor/register', userData);
            
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            set({ user: data.user, token: data.token, isLoading: false });
            return true;
        } catch (error) {
            set({ 
                error: error.response?.data?.message || 'Registration failed', 
                isLoading: false 
            });
            return false;
        }
    },

    logout: async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            set({ user: null, token: null });
        }
    }
}));
