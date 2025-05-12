import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://e-commerce-backend-87to.onrender.com',
        changeOrigin: true,
        secure: false, // Recommended for Render backend
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: remove /api prefix
      }
    }
  },
});