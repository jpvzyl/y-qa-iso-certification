import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/y-qa-iso-certification/',
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
