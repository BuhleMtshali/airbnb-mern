import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward all requests starting with /upload-by-link to backend
      '/upload-by-link': 'http://localhost:4000',
      // If you have other API endpoints, add them here
      // '/api': 'http://localhost:4000',
    },
  },
})
