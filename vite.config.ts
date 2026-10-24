import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    const isCapacitor = process.env.BUILD_TARGET === 'capacitor';

    return {
        base: isCapacitor ? './' : '/r/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: true as const,
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          manifestFilename: 'manifest-v2.webmanifest',
          includeAssets: ['assets/**', 'manifest-v2.webmanifest'],
          manifest: {
            name: 'Horologium Romanum',
            short_name: 'Horologium',
            description: 'Reloj y Calendario Romano',
            theme_color: '#1a1a1a',
            background_color: '#1a1a1a',
            display: 'standalone',
            start_url: isCapacitor ? './index.html' : '/r/',
            scope: isCapacitor ? './' : '/r/',
            id: isCapacitor ? './' : '/r/',
            icons: [
              {
                src: 'assets/horologium-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
            // roads.json (2.9 MB) is over Workbox's 2 MiB glob limit; it is precached through
            // includeAssets like the other Roman map layers.
            globIgnores: ['**/node_modules/**', 'assets/roman-map/roads.json'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
      ],
      resolve: {
        alias: {
          '@': import.meta.dirname,
        }
      }
    };
});
