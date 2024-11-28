import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    server: {
      proxy: {
        '/profesoft': {
          target: process.env.VITE_HOST_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });