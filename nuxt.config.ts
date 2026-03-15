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
        'script-src': [
          '\'self\'', 
          '\'unsafe-inline\'', 
          'https://*.qalpuch.cc', 
          'https://static.cloudflareinsights.com' // Allow Cloudflare analytics
        ],
        'connect-src': ['\'self\'', 'https://api.vicket.app', 'https://cloudflareinsights.com']
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
    '/api/vicket/**': { cache: { maxAge: 60 } },
    // Force long cache for static assets (Fix Lighthouse insight)
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
  },

  // --- SEO & Crawling ---
  robots: {
    disallow: ['/api'],
    allow: ['/']
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
      title: 'Vicket Support',
      link: [
        { rel: 'preconnect', href: 'https://static.cloudflareinsights.com' }
      ]
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
    allow: ['/'],
    blockAI: false // Avoid non-standard Content-Signal directive
  },

  css: ['~/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'fr',
    strategy: 'no_prefix'
  },

  colorMode: { classSuffix: '' },
  future: { compatibilityVersion: 4 },
  ssr: true,
  experimental: {
    viewTransition: true,
    componentIslands: true,
    payloadExtraction: process.env.NODE_ENV === 'production'
  },

  runtimeConfig: {
    public: {
      buildVersion: String(Date.now())
    }
  },

  sourcemap: {
    server: true,
    client: true
  },

  nitro: {
    routeRules: {
      '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    }
  },

  compatibilityDate: '2025-01-15',

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}
    }
  }
})