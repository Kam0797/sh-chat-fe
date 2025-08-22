import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs'
  },
  base: '/sh-chat-fe/',
  plugins: [react(), svgr()],
  css: {
    modules: {
      localsConvention: 'camelCase' // support both camelCase and kebab-case
    }
  }
})
