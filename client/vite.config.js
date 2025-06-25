import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    minify: "esbuild",
    outDir: "dist",
  },
  server: {
    proxy: {
      '/api': {
        target: "https://prepgenius-backend.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
