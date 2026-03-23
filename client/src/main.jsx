import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './pwa/serviceWorker'

import { ThemeProvider } from './contexts/ThemeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)

// Register PWA service worker
registerServiceWorker()

