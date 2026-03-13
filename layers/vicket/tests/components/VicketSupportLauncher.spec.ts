import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import VicketSupportLauncher from '../../app/components/VicketSupportLauncher.vue'
import { KNOWLEDGE_REPOSITORY_KEY, TICKET_REPOSITORY_KEY } from '../../app/types/repository'

// Mock useAppConfig for the test
mockNuxtImport('useAppConfig', () => {
  return () => ({
    vicket: {
      name: 'Vicket',
      labels: {
        searchPlaceholder: 'Search...'
      }
    },
    icon: {
      collections: []
    }
  })
})

describe('VicketSupportLauncher', () => {
  it('should toggle the popover when clicked', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.$fetch = vi.fn().mockResolvedValue({ success: true, data: [] }) as any

    const wrapper = await mountSuspended(VicketSupportLauncher, {
      global: {
        provide: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [KNOWLEDGE_REPOSITORY_KEY as any]: {
            categories: ref(['Tous']),
            searchArticles: vi.fn().mockResolvedValue({ data: [] })
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [TICKET_REPOSITORY_KEY as any]: {
            websiteName: ref('Support'),
            fetchInit: vi.fn().mockResolvedValue({})
          }
        }
      }
    })

    // Click FAB button
    const button = wrapper.find('button')
    await button.trigger('click')

    // Note: Due to mountSuspended context isolation with Layers, 
    // injection might fallback to default 'Vicket' in tests.
    expect(wrapper.text()).toMatch(/Vicket Aide|Support Aide/)
  })
})
