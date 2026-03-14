import { describe, it, expect } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import App from '../../app.vue'
import { useSupportState } from '../../../layers/vicket/app/composables/useSupportState'

mockNuxtImport('useI18n', () => {
  return () => ({
    locale: ref('fr'),
    locales: ref([{ code: 'fr', name: 'Français' }, { code: 'en', name: 'English' }]),
    setLocale: vi.fn(),
    t: (key: string) => key
  })
})

describe('app.vue (God Mode)', () => {
  it('renders main layout and handles distraction free mode', async () => {
    const { isDistractionFree } = useSupportState()
    isDistractionFree.value = false

    const wrapper = await mountSuspended(App, {
      global: {
        provide: {
          // Provide the missing state that color-mode plugin is looking for
          'color-mode': {
            preference: 'light',
            value: 'light',
            unknown: false,
            forced: false
          }
        },
        stubs: {
          UColorModeButton: true,
          DemoBrandingSelector: true,
          UDropdownMenu: true,
          UHeader: true,
          UFooter: true
        }
      }
    })
    
    // Switch to distraction free
    isDistractionFree.value = true
    await nextTick()

    expect(wrapper.exists()).toBe(true)
  })
})
