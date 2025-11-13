import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        scoring: './scoring.html',
        display: './display.html',
        mobile: './mobile.html',
        leaderboard: './leaderboard.html'
      }
    },
    copyPublicDir: true
  },
  publicDir: 'public'
});
