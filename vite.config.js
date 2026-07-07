import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})