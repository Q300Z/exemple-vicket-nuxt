import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useTicketPolling } from '../../app/composables/useTicketPolling'
import { TICKET_REPOSITORY_KEY } from '../../app/types/repository'

const mockTickets = {
  fetchTicketThread: vi.fn()
}

describe('useTicketPolling (Industrial Logic)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  it('starts and stops polling correctly', async () => {
    let polling: { isPolling: Ref<boolean>, startPolling: () => void, stopPolling: () => void } | undefined
    
    const TestComponent = defineComponent({
      setup() {
        polling = useTicketPolling(ref('tok'), vi.fn()) as unknown as { isPolling: Ref<boolean>, startPolling: () => void, stopPolling: () => void }
        return () => h('div')
      }
    })

    mount(TestComponent, {
      global: {
        provide: {
          'TICKET_REPOSITORY': mockTickets
        }
      }
    })
    
    if (polling) {
      expect(polling.isPolling.value).toBe(false)
      polling.startPolling()
      expect(polling.isPolling.value).toBe(true)
      polling.stopPolling()
      expect(polling.isPolling.value).toBe(false)
    }
  })

  it('stops polling after too many errors', async () => {
    mockTickets.fetchTicketThread.mockRejectedValue(new Error('Persistent Fail'))
    
    let polling: { isPolling: Ref<boolean>, startPolling: () => void } | undefined
    const TestComponent = defineComponent({
      setup() {
        polling = useTicketPolling(ref('tok'), vi.fn()) as unknown as { isPolling: Ref<boolean>, startPolling: () => void }
        return () => h('div')
      }
    })

    mount(TestComponent, {
      global: {
        provide: {
          'TICKET_REPOSITORY': mockTickets
        }
      }
    })

    if (polling) {
      polling.startPolling()
      
      // Simulate 6 intervals (max is 5 errors)
      for(let i=0; i<6; i++) {
        await vi.advanceTimersByTimeAsync(30000)
      }
      
      expect(polling.isPolling.value).toBe(false)
    }
  })
})
