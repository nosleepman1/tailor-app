import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

let currentApiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.16:8008/api/v2';

export const getApiUrl = (): string => currentApiUrl;

export const setCustomApiUrl = async (newUrl: string): Promise<void> => {
  currentApiUrl = newUrl.trim().replace(/\/+$/, '');
  if (!currentApiUrl.endsWith('/api/v2')) {
    currentApiUrl += '/api/v2';
  }
  await SecureStore.setItemAsync('tailor_custom_api_url', currentApiUrl);
  api.defaults.baseURL = currentApiUrl;
};

// Initialize custom URL if saved
SecureStore.getItemAsync('tailor_custom_api_url').then((savedUrl) => {
  if (savedUrl) {
    currentApiUrl = savedUrl;
    api.defaults.baseURL = savedUrl;
  }
}).catch(() => {});

const api: AxiosInstance = axios.create({
  baseURL: currentApiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip Ngrok warning screen automatically
  },
});

// Request interceptor: Inject Bearer Token & ensure dynamic baseURL
api.interceptors.request.use(
  async (config) => {
    config.baseURL = currentApiUrl;
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
