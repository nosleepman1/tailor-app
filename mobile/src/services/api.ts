import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  // Check if defined in app.json extra
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) return extraApiUrl;

  // Local development default IPs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v2';
  }
  return 'http://localhost:8000/api/v2';
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
