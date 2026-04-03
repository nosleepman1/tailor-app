import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './pwa/serviceWorker'

import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

// 🔥 In development, unregister ALL service workers to prevent loops
if (import.meta.env.MODE === 'development') {
  console.log('[Dev Mode] Unregistering all service workers...');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`Found ${registrations.length} service workers`);
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log('[SW] Unregistered:', registration.scope);
        });
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // 🔧 StrictMode disabled in dev to prevent double effect calls
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </QueryClientProvider>
)

// ✅ Only register PWA in production
if (import.meta.env.MODE === 'production') {
  // If PWA plugin isn't auto-registering, fallback to manual registration
  if (typeof registerServiceWorker === 'function') {
    registerServiceWorker();
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}
