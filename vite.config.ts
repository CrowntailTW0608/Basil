import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {resolve} from 'path';

export default defineConfig(({mode}) => {
  const isProd = mode === 'production';
  return {
    base: isProd ? '/Basil/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main:   resolve(__dirname, 'index.html'),
          mimosa: resolve(__dirname, 'mimosa.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
