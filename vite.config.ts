import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [solidPlugin(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:8080"
    }
  }
});