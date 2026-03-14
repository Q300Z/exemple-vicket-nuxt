// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['./layers/vicket'],

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/eslint',
    'nuxt-security',
    '@vueuse/motion/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/a11y'
  ],

  // --- Security & Hardening (Industrial Standards) ---
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'blob:', 'https://api.vicket.app'],
        'script-src': ['\'self\'', '\'unsafe-inline\'', 'https://*.qalpuch.cc'],
        'connect-src': ['\'self\'', 'https://api.vicket.app']
      }
    },
    rateLimiter: {
      tokensPerInterval: 10,
      interval: 'hour',
      headers: true
    }
  },

  // --- Performance & Scalability (ISR/SWR) ---
  routeRules: {
    '/support/**': { swr: 3600 },
    '/api/vicket/tickets': { security: { rateLimiter: { tokensPerInterval: 5, interval: 'minute' } } },
    '/api/vicket/**': { cache: { maxAge: 60 } }
  },

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
    url: 'https://vicket.qalpuch.cc',
    name: 'Vicket Showcase',
    description: 'Démonstration industrielle du support client Vicket avec Nuxt 4.',
    defaultLocale: 'fr'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      },
      title: 'Vicket Support'
    }
  },

  seo: {
    redirectToCanonicalSiteUrl: true
  },

  sitemap: {
    zeroRuntime: true,
    autoLastmod: true,
    sources: ['/api/vicket/sitemap-urls']
  },

  ogImage: { enabled: false },

  robots: {
    disallow: ['/api'],
    allow: ['/']
  },

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
  ssr: true,
  experimental: {
    viewTransition: true,
    payloadExtraction: process.env.NODE_ENV === 'production'
  },

  compatibilityDate: '2025-01-15',

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})