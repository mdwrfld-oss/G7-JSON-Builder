import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/G7-JSON-Builder/', // ✅ critical for GitHub Pages
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
fix: correct vite base path for github pages
