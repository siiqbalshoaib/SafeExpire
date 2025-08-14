import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',  // ensures users get updates promptly
      injectRegister: 'auto',
      devOptions: {
        enabled: true,                // great for local testing on HTTP
      },
      manifest: {
        name: 'Safe Expire',
        short_name: 'SafeExpire',
        description: 'Track expirations with peace of mind',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-2.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  server: {
    historyApiFallback: true, // VERY IMPORTANT
  },
  base: '/',
  
})
