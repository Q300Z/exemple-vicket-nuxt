import { defineNuxtConfig } from 'nuxt/config'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

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
      resolve('./app/composables'),
      resolve('./app/utils'),
      resolve('./app/types'),
      resolve('./app/services')
    ]
  },

  components: [
    { path: resolve('./app/components'), prefix: 'Vicket' }
  ],

  css: [
    resolve('./app/assets/css/vicket.css')
  ],

  alias: {
    '#vicket/types': resolve('./app/types'),
    '#vicket/utils': resolve('./app/utils'),
    '#vicket/composables': resolve('./app/composables')
  },

  runtimeConfig: {
    public: {
      vicketApiUrl: 'https://api.vicket.app/api/v1',
      vicketApiKey: ''
    }
  }
})
