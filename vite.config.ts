import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This is critical for GitHub Pages. It ensures assets use relative paths.
  base: '/G7-JSON-Builder/', 
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
