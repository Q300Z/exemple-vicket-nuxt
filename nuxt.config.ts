// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['./layers/vicket'],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode'
  ],

  // --- OPTIMISATION ICONES ULTIME : Remote API ---
  icon: {
    serverBundle: 'none'
  },

  // --- Nuxt UI v4 Ultra-Optimized ---
  ui: {
    // @ts-expect-error - Nuxt UI v4 type detection
    scan: true
  },

  site: {
    url: 'https://demo-vicket.app',
    name: 'Vicket Showcase',
    description: 'Démonstration industrielle du support client Vicket avec Nuxt 4.',
    defaultLocale: 'fr'
  },

  seo: {
    fallbackTitle: false,
    automaticTitles: true,
    redirectToCanonicalSiteUrl: true
  },

  sitemap: {
    // @ts-expect-error - ZeroRuntime type in sitemap module
    zeroRuntime: true,
    autoLastmod: true,
    sources: ['/api/vicket/sitemap-urls']
  },

  ogImage: { enabled: false },

  css: ['~/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français' },
      { code: 'en', language: 'en-US', name: 'English' }
    ],
    defaultLocale: 'fr',
    strategy: 'no_prefix',
    bundle: {
      runtimeOnly: true,
      fullInstall: false
    }
  },

  colorMode: { classSuffix: '' },
  future: { compatibilityVersion: 4 },
  ssr: process.env.NUXT_SSR !== 'false',
  experimental: {
    viewTransition: true,
    componentDetection: true,
    payloadExtraction: true 
  },

  compatibilityDate: '2025-01-15',

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})
