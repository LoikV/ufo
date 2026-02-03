import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()] as import('vite').PluginOption[],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-leaflet': path.resolve(__dirname, './src/test/mocks/react-leaflet.tsx'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
