import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
      manifest: {
        name: 'Astro Marriage - Kundali Matching & Marriage Compatibility',
        short_name: 'Astro Marriage',
        description: 'Free Vedic astrology marriage compatibility analysis with Ashtakoot Milan',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f0d1a',
        theme_color: '#4f46e5',
        orientation: 'portrait',
        categories: ['lifestyle', 'utilities'],
        lang: 'en-IN',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    // Sentry source-map upload — only active when SENTRY_AUTH_TOKEN is set in CI/Vercel
    ...(process.env.SENTRY_AUTH_TOKEN ? [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT || 'marriage-astro',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: { assets: './dist/**' },
        release: { name: process.env.VITE_APP_VERSION },
      }),
    ] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@knowledge': path.resolve(__dirname, './knowledge'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    // Sourcemaps enabled only when Sentry uploads them (deleted from CDN post-deploy)
    sourcemap: Boolean(process.env.SENTRY_AUTH_TOKEN),
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['recharts', 'lucide-react', 'react-markdown'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-state': ['zustand'],
        },
      },
    },
  },
})
