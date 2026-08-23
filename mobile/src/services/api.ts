import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  // 1. Check if configured in app.json extra
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) return extraApiUrl;

  // 2. Default Wi-Fi IP for direct iPhone & Android access
  return 'http://192.168.1.16:8000/api/v2';
};

export const API_URL = getBaseUrl();

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
