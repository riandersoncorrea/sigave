import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // GH_PAGES_BASE só é setada pelo workflow de deploy (.github/workflows/
  // deploy.yml) — localmente (dev/build/preview) o base continua "/".
  base: process.env.GH_PAGES_BASE || '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Precache do app shell (HTML/CSS/JS) para o app abrir mesmo sem
      // conexão. Escopo desta sprint é "não perder preenchimento" — não
      // uma fila de sincronização de escrita offline (ver useDraftStep /
      // useDraftList, que já cobrem o rascunho local).
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
      manifest: {
        name: 'SIGAVE CAMPO',
        short_name: 'SIGAVE',
        description: 'Levantamento e diagnóstico de Áreas Verdes de Manutenção',
        lang: 'pt-BR',
        theme_color: '#007E7A',
        background_color: '#F4F4F4',
        display: 'standalone',
        // Caminhos relativos (sem "/" inicial) para funcionar tanto na
        // raiz (dev) quanto sob /sigave/ (GitHub Pages) — um caminho
        // absoluto ignoraria o base e quebraria no subpath.
        start_url: '.',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
