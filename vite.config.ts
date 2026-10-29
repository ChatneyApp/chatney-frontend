import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import yaml from '@rollup/plugin-yaml';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), yaml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"]
  }
});