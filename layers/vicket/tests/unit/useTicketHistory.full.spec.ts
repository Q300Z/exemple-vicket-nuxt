import { describe, it, expect, vi } from 'vitest'
import { useTicketHistory } from '../../app/composables/useTicketHistory'

// Mock useCookie
const mockCookie = ref<any[]>([])
vi.stubGlobal('useCookie', () => mockCookie)

describe('useTicketHistory (Coverage Boost)', () => {
  it('saves and deduplicates tickets', () => {
    const { saveTicket, ticketHistory } = useTicketHistory(2)
    mockCookie.value = []

    saveTicket({ id: '1', token: 'a', title: 'T1' })
    saveTicket({ id: '2', token: 'b', title: 'T2' })
    saveTicket({ id: '1', token: 'a', title: 'T1 UPDATED' }) // Should deduplicate

    expect(ticketHistory.value).toHaveLength(2)
    expect(ticketHistory.value[0].title).toBe('T1 UPDATED')
  })

  it('respects max items limit', () => {
    const { saveTicket, ticketHistory } = useTicketHistory(2)
    mockCookie.value = []

    saveTicket({ id: '1', token: 'a', title: 'T1' })
    saveTicket({ id: '2', token: 'b', title: 'T2' })
    saveTicket({ id: '3', token: 'c', title: 'T3' })

    expect(ticketHistory.value).toHaveLength(2)
    expect(ticketHistory.value[0].id).toBe('3')
  })

  it('clears history', () => {
    const { saveTicket, clearHistory, ticketHistory } = useTicketHistory()
    saveTicket({ id: '1', token: 'a', title: 'T1' })
    clearHistory()
    expect(ticketHistory.value).toHaveLength(0)
  })
})
