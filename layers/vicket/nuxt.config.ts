import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // The layer can have its own modules (SRP)
  modules: [
    '@nuxt/ui',
    '@nuxtjs/device',
    '@vueuse/nuxt'
  ],

  imports: {
    dirs: [
      r('./app/composables'),
      r('./app/utils'),
      r('./app/types'),
      r('./app/services')
    ]
  },

  components: [
    { path: r('./app/components'), prefix: 'Vicket' }
  ],

  css: [
    r('./app/assets/css/vicket.css')
  ],

  alias: {
    '#vicket/types': r('./app/types'),
    '#vicket/utils': r('./app/utils'),
    '#vicket/composables': r('./app/composables')
  },

  runtimeConfig: {
    public: {
      vicketApiUrl: 'https://api.vicket.app/api/v1',
      vicketApiKey: ''
    }
  }
})
