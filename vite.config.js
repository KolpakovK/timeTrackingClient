import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://207.154.193.21:3000",
        changeOrigin: true,
        secure: false,      
        ws: true,
      },
    },
  },
  plugins: [vue()],
})
