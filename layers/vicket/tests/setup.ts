import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import fr from '../../../i18n/locales/fr.json'

/**
 * Global Vitest Setup for Vicket Layer (SRP).
 * Mocks Nuxt modules and i18n for isolated component testing.
 */

// Simple helper to get nested keys from translation object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTranslation = (key: string, data: any = fr): string => {
  const parts = key.split('.')
  let current = data
  for (const part of parts) {
    if (current[part] === undefined) return key
    current = current[part]
  }
  return typeof current === 'string' ? current : key
}

// Mock i18n global functions
config.global.mocks = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $t: (key: string, params?: any) => {
    let text = getTranslation(key)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  },
  $d: (d: string) => d,
  $n: (n: number) => n
}

// Mock useI18n composable
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: (key: string, params?: any) => config.global.mocks.$t(key, params),
    locale: { value: 'fr' }
  })
}))

// Mock directives
config.global.directives = {
  motion: {}
}

// Mock Nuxt Link & Components
config.global.stubs = {
  NuxtLink: { name: 'NuxtLink', template: '<a><slot /></a>' },
  UIcon: { name: 'UIcon', template: '<span />' },
  UButton: { 
    name: 'UButton', 
    props: ['label'],
    template: '<button>{{ label }}<slot /></button>' 
  },
  UInput: { 
    name: 'UInput', 
    props: ['modelValue'],
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />' 
  },
  UBadge: { name: 'UBadge', template: '<span />' },
  UCheckbox: { name: 'UCheckbox', template: '<input type="checkbox" />' },
  UCheckboxGroup: { name: 'UCheckboxGroup', template: '<div />' },
  UModal: { name: 'UModal', template: '<div v-if="$attrs.modelValue"><slot name="content" /></div>' },
  UCard: { name: 'UCard', template: '<div><slot /><slot name="header" /><slot name="footer" /></div>' },
  UForm: { name: 'UForm', template: '<form><slot /></form>' },
  UFormField: { name: 'UFormField', template: '<div><slot /></div>' },
  UTextarea: { name: 'UTextarea', template: '<textarea />' },
  UCollapsible: { name: 'UCollapsible', template: '<div><slot /><slot name="content" /></div>' }
}
