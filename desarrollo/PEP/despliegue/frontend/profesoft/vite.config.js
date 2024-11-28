import { resolve } from 'path'
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        busqueda: resolve(__dirname, 'busqueda/index.html'),
        foro: resolve(__dirname, 'foro/index.html'),
        foros: resolve(__dirname, 'foros/index.html'),
        profesor: resolve(__dirname, 'profesor/index.html'),
        registro: resolve(__dirname, 'registro/index.html'),
      },
    },
  },
  server: {
    proxy: {
      '/profesoft': {
        target: process.env.VITE_HOST_URL, 
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
          });
        },
      },
    },
  },
});
