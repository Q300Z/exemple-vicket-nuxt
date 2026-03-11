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
    vi.stubGlobal('useSupportState', () => ({
      isLoading: ref(false),
      loadError: ref(null)
    }))
    vi.stubGlobal('useFiles', () => ({
      buckets: ref({}),
      clearAll: vi.fn()
    }))
    vi.stubGlobal('useVisualEffects', () => ({
      fireSuccessConfetti: vi.fn()
    }))
  })

  it('should render identification step initially', async () => {
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { open: true, templates: mockTemplates },
      global: {
        provide: {
          [NOTIFICATION_SERVICE_KEY as symbol]: mockNotifications
        }
      }
    })
    
    expect(wrapper.text()).toContain('Votre adresse email')
  })

  it('should move to details step when email is provided', async () => {
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { open: true, templates: mockTemplates },
      global: {
        provide: {
          [NOTIFICATION_SERVICE_KEY as symbol]: mockNotifications
        }
      }
    })
    
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('test@example.com')
    
    const submitBtn = wrapper.find('button[type="submit"]')
    await submitBtn.trigger('click')
    
    expect(wrapper.text()).toContain('Sujet de la demande')
  })
})
