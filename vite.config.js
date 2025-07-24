import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // equivale a 0.0.0.0
    port: 5173,
    strictPort: true, // erro se a porta estiver ocupada
    hmr: {
      host: '192.168.5.32', // substitua pelo IP do seu servidor
      protocol: 'ws',
      port: 5173,
    },
  },
});