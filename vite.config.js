import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/game': {
          target: 'https://adventure.wietsevenema.eu',
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('Authorization', `ApiKey ${env.API_KEY}`);
            });
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
    },
  }
})
