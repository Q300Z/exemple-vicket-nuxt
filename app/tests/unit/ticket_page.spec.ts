import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TicketPage from '../../pages/ticket.vue'

const mockTickets = {
  fetchTicketThread: vi.fn().mockResolvedValue({
    id: '1', title: 'My Ticket', messages: [], answers: []
  }),
  sendReply: vi.fn()
}

describe('Ticket Thread Page', () => {
  it('renders thread', async () => {
    const wrapper = await mountSuspended(TicketPage, {
      route: '/ticket?token=abc',
      global: {
        provide: {
          'TICKET_REPOSITORY': mockTickets,
          'NOTIFICATION_SERVICE': { success: vi.fn(), error: vi.fn() }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
