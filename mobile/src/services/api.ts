import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  // 1. Check EXPO_PUBLIC_API_URL from mobile/.env (Ngrok / Production)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Check if configured in app.json extra
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) {
    return extraApiUrl;
  }

  // 3. Default Wi-Fi IP and dedicated port 8008 for direct iPhone access
  return 'http://192.168.1.16:8008/api/v2';
};

export const API_URL = getBaseUrl();

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip Ngrok warning banner automatically
  },
});

// Request interceptor: Inject Bearer Token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('tailor_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global Error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('tailor_auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;
