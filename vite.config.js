import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — React + path alias for clean imports.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
