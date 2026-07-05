import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/school-dashboard/' saat build (GitHub Pages subpath), '/' saat dev lokal
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/school-dashboard/' : '/',
}))
