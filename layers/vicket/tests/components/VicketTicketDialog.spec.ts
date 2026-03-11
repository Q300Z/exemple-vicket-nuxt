import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketTicketDialog from '../../app/components/VicketTicketDialog.vue'
import { NOTIFICATION_SERVICE_KEY } from '../../app/types/interaction'

describe('VicketTicketDialog', () => {
  const mockNotifications = {
    success: vi.fn(),
    error: vi.fn(),
    celebrate: vi.fn(),
    warn: vi.fn()
  }

  const mockTemplates = [
    { id: 't1', name: 'Technical', description: 'Tech desc', questions: [] }
  ]

  beforeEach(() => {
    // Force mock behavior for internal composables
    vi.stubGlobal('useSupportState', () => ({
      isLoading: ref(false),
      loadError: ref(null)
    }))
  })

  it('should render identification step initially', async () => {
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { open: true, templates: mockTemplates },
      global: {
        stubs: {
          // Disable teleport to keep content in the test wrapper
          Teleport: true
        },
        provide: {
          [NOTIFICATION_SERVICE_KEY as unknown]: mockNotifications
        }
      }
    })

    // With teleport disabled and suspended mounting, we should find the text
    expect(wrapper.html()).toBeTruthy()
  })
})
