import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Portable build settings:
// - base './' makes production asset paths relative, so the same build works on
//   Netlify, GitHub Pages project URLs, and local file previews.
// - Set BASE_URL only if you intentionally need an absolute base path.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
