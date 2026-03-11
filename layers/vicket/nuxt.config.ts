import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

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
      'app/composables',
      'app/utils',
      'app/types'
    ]
  },

  css: [
    join(currentDir, './app/assets/css/vicket.css')
  ],

  runtimeConfig: {
    public: {
      vicketApiUrl: 'https://api.vicket.app/api/v1',
      vicketApiKey: ''
    }
  }
})
