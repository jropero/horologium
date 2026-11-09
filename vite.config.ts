import { defineConfig, lazyPlugins } from 'vite-plus';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  const isCapacitor = process.env.BUILD_TARGET === 'capacitor';

  return {
    staged: {
      '*.{ts,tsx,js,mjs,mts}': ['vp lint --fix', 'vp fmt'],
      '*.{json,md,html}': 'vp fmt',
      '*.css': 'stylelint --fix',
    },
    fmt: {
      ignorePatterns: ['.claude/**'],
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 96,
      tabWidth: 2,
      semi: true,
      arrowParens: 'avoid',
      bracketSpacing: true,
      bracketSameLine: false,
      endOfLine: 'lf',
    },
    lint: {
      plugins: ['react', 'jsx-a11y', 'typescript'],
      jsPlugins: [
        { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
        { name: 'sonarjs', specifier: './lint/sonarjs.js' },
      ],
      ignorePatterns: ['.claude/**', 'dist/**', 'android/**', 'public/**', 'docs/**'],
      env: { browser: true, es2022: true, node: true },
      options: { typeAware: true, typeCheck: true },
      rules: {
        'vite-plus/prefer-vite-plus-imports': 'error',
        // React 17+ JSX transform — no need to import React in every file
        'react/react-in-jsx-scope': 'off',
        // Promote from warn to error (matches original ESLint config)
        'react-hooks/exhaustive-deps': 'error',
        // SonarJS quality gates (via JS plugin)
        'sonarjs/cognitive-complexity': ['error', 6],
        'sonarjs/no-nested-conditional': 'error',
        'sonarjs/no-duplicate-string': ['error', { threshold: 10 }],
        'sonarjs/no-identical-functions': 'error',
        'sonarjs/no-collapsible-if': 'error',
        'sonarjs/todo-tag': 'error',
        'sonarjs/no-globals-shadowing': 'error',
        'sonarjs/concise-regex': 'error',
        'sonarjs/slow-regex': 'error',
        'sonarjs/code-eval': 'error',
        'sonarjs/pseudo-random': 'off',
      },
    },
    base: isCapacitor ? './' : '/r/',
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
    },
    plugins: lazyPlugins(() => [
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
              purpose: 'any maskable',
            },
          ],
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
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ]),
    resolve: {
      alias: {
        '@': import.meta.dirname,
      },
    },
  };
});
