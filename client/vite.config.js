import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    

    ...(process.env.NODE_ENV === 'production' ? [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons.svg', 'logo.png'],
        manifest: {
          name: 'TailleurPro',
          short_name: 'TailleurPro',
          description: 'Gestion professionnelle de tailleurs',
          theme_color: '#1a1a2e',
          background_color: '#0f0f1a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          icons: [
            { src: 'logo.png', sizes: '192x192', type: 'image/png' },
            { src: 'logo.png', sizes: '512x512', type: 'image/png' },
            { src: 'logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        injectManifest: {
          injectionPoint: null,
        },
      })
    ] : []),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
  // 🚀 BUILD OPTIMIZATION
  build: {
    // 🔥 Code splitting for smaller initial load
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-zustand': ['zustand'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-icons': ['lucide-react'],
          'vendor-ui': ['tailwindcss'],
          

          'page-auth': ['./src/pages/Login.jsx', './src/pages/Register.jsx'],
          'page-dashboard': ['./src/pages/client/Dashboard.jsx', './src/pages/admin/Dashboard.jsx'],
          'page-clients': ['./src/pages/client/Clients.jsx', './src/pages/client/ClientForm.jsx'],
          'page-orders': ['./src/pages/client/EventsOrders.jsx', './src/pages/client/OrderForm.jsx'],
        }
      }
    },

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Report compressed size
    reportCompressedSize: true,
    // Inline small static assets
    assetsInlineLimit: 8192,
    // CSS split
    cssCodeSplit: true,
  },
  // 🚀 DEV SERVER OPTIMIZATION
  server: {
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // Proxy API calls to Laravel backend — évite les problèmes CORS/HTTPS en dev
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // 🚀 PREVIEW OPTIMIZATION (production build preview)
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    }
  }
})
