// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['./layers/vicket'],

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/seo'
  ],

  imports: {
    dirs: ['layers/vicket/app/utils']
  },

  devtools: {
    enabled: true
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  runtimeConfig: {
    public: {
      vicketApiKey: '' // Overwritten by NUXT_PUBLIC_VICKET_API_KEY
    }
  },

  routeRules: {
    // Static generation for the home page (Performance)
    '/': { prerender: true },
    // SWR: Cache support list for 1 hour, serve stale while revalidating in background (Scalability)
    '/support': { swr: 3600 },
    // SWR: Cache articles individually for 1 hour
    '/support/**': { swr: 3600 },
    // No SSR for ticket thread as it's private and live (Security/Live)
    '/ticket': { ssr: false }
  },

  future: {
    compatibilityVersion: 4
  },
  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2025-01-15',

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
