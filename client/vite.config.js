import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __WS_TOKEN__: JSON.stringify(''), //set an empty string, vite will take care of updating it
  //or define it with a random generated token
  },
})