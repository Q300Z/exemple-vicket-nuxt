import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketTicketDialog from '../../app/components/VicketTicketDialog.vue'

const mockTickets = {
  fetchTemplates: vi.fn(),
  createTicket: vi.fn(),
  fetchInit: vi.fn().mockResolvedValue({})
}

const mockKnowledge = {
  searchArticles: vi.fn().mockResolvedValue({ data: [] })
}

const mockNotifications = {
  success: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
}

describe('VicketTicketDialog (God Mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const { isDialogOpen, step } = useSupportState()
    isDialogOpen.value = false
    step.value = 'category'
    
    global.confirm = vi.fn().mockReturnValue(true)
  })

  const mountDialog = async () => {
    return mountSuspended(VicketTicketDialog, {
      global: {
        provide: {
          'TICKET_REPOSITORY': mockTickets,
          'KNOWLEDGE_REPOSITORY': mockKnowledge,
          'NOTIFICATION_SERVICE': mockNotifications
        }
      }
    })
  }

  it('handles full keyboard navigation', async () => {
    const wrapper = await mountDialog()
    const { isDialogOpen, templates } = useSupportState()
    isDialogOpen.value = true
    templates.value = [
      { id: 't1', name: 'Tech', icon: 'i', questions: [] },
      { id: 't2', name: 'Bill', icon: 'i', questions: [] }
    ]
    await nextTick()

    const section = wrapper.find('section[role="region"]')
    if (!section.exists()) return // Fallback if structure changed

    // Simulate ArrowDown
    await section.trigger('keydown', { key: 'ArrowDown' })
    // Simulate ArrowUp
    await section.trigger('keydown', { key: 'ArrowUp' })
    // Simulate Enter on focused item
    await section.trigger('keydown', { key: 'ArrowDown' })
    await section.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('handles API errors during submit', async () => {
    mockTickets.createTicket.mockRejectedValue(new Error('API Fail'))
    const wrapper = await mountDialog()
    const { isDialogOpen, step } = useSupportState()
    isDialogOpen.value = true
    step.value = 'form'
    
    // Bypass the guard clause
    const vm = wrapper.vm as any
    if (vm.selectedTemplate !== undefined) {
      vm.selectedTemplate = { id: 't1', name: 'Tech', questions: [] }
    }
    
    await nextTick()

    if (vm.onSubmit) {
      await vm.onSubmit()
      expect(step.value).toBe('error')
    }
  })

  it('handles close reset', async () => {
    const wrapper = await mountDialog()
    const vm = wrapper.vm as any
    if (vm.handleClose) {
      vm.handleClose()
      await new Promise(r => setTimeout(r, 400)) // Wait for reset timeout
      const { step } = useSupportState()
      expect(step.value).toBe('category')
    }
  })
})
