import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // base: '/Kitchen-Solution-Suite-App/' 
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - librerías de terceros
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          'router': ['react-router-dom'],
          'state': ['zustand'],
          'forms': ['react-hook-form'],
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'auth': ['@react-oauth/google'],
          'qr': ['qr-code-styling']
        }
      }
    },
    // Aumentar límite de advertencia de chunk
    chunkSizeWarningLimit: 600
  }
})
