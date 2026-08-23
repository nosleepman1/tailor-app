import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { User } from '../types';
import { NotificationService } from '../services/notificationService';
import { SyncService } from '../services/syncService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (login: string, passwordOrPin: string) => Promise<void>;
  register: (payload: { name: string; phone: string; email?: string; password?: string; pin?: string; city?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = async () => {
    try {
      const savedToken = await SecureStore.getItemAsync('tailor_auth_token');
      const savedUser = await SecureStore.getItemAsync('tailor_auth_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token with backend
        refreshProfile().catch(() => {});
      }
    } catch (e) {
      console.warn('Error loading auth session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const login = async (loginInput: string, passwordOrPin: string) => {
    // Non-blocking push token registration
    const pushToken = await NotificationService.registerForPushNotifications().catch(() => null);

    const response = await api.post('/login', {
      login: loginInput.trim(),
      password_or_pin: passwordOrPin.trim(),
      expo_push_token: pushToken,
    });

    const { token: receivedToken, user: receivedUser } = response.data.data;
    setToken(receivedToken);
    setUser(receivedUser);

    await SecureStore.setItemAsync('tailor_auth_token', receivedToken);
    await SecureStore.setItemAsync('tailor_auth_user', JSON.stringify(receivedUser));

    await NotificationService.playSuccessSoundAndHaptic();
    // Trigger initial delta sync in background
    SyncService.synchronize().catch(() => {});
  };

  const register = async (payload: { name: string; phone: string; email?: string; password?: string; pin?: string; city?: string }) => {
    const pushToken = await NotificationService.registerForPushNotifications().catch(() => null);

    const cleanPayload = {
      ...payload,
      password: payload.password || payload.pin || 'passer123',
      expo_push_token: pushToken,
    };

    const response = await api.post('/register', cleanPayload);

    const { token: receivedToken, user: receivedUser } = response.data.data;
    setToken(receivedToken);
    setUser(receivedUser);

    await SecureStore.setItemAsync('tailor_auth_token', receivedToken);
    await SecureStore.setItemAsync('tailor_auth_user', JSON.stringify(receivedUser));

    await NotificationService.playSuccessSoundAndHaptic();
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/me');
      if (response.data?.data?.user) {
        const freshUser = response.data.data.user;
        setUser(freshUser);
        await SecureStore.setItemAsync('tailor_auth_user', JSON.stringify(freshUser));
      }
    } catch (e) {
      // Offline fallback
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout').catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      await SecureStore.deleteItemAsync('tailor_auth_token');
      await SecureStore.deleteItemAsync('tailor_auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
