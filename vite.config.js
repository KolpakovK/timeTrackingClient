import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target:"http://207.154.193.21:3000",
        changeOrigin: true,
        secure: false,
				rewrite: (p) => {
          console.log('Original Path:', p);
          const rewrittenPath = p.replace(/^\/api/, "");
          console.log('Rewritten Path:', rewrittenPath);
          return rewrittenPath;
       },
      },
    },
    cors: false
  },
  plugins: [vue()],
})
