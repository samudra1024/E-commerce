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
      'base_url': {
        target: 'https://e-commerce-backend-87to.onrender.com',
        changeOrigin: true,
      },
    },
  },
});