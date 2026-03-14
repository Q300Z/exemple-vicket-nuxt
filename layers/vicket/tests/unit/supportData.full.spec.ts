import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSupportData } from '../../app/composables/useSupportData'

const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('SupportData Repository (Full Logic Coverage)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Knowledge Repository', () => {
    it('searchArticles handles successful response', async () => {
      const { knowledge } = useSupportData()
      mockFetch.mockResolvedValue({ success: true, data: [{ id: '1' }] })
      const res = await knowledge.searchArticles('query')
      expect(res.data).toHaveLength(1)
    })

    it('searchArticles handles empty/error response with fallback', async () => {
      const { knowledge } = useSupportData()
      mockFetch.mockRejectedValue(new Error('API Down'))
      const res = await knowledge.searchArticles('query')
      expect(res.success).toBe(true)
      expect(res.data[0].id).toBe('d1')
    })
  })

  describe('Tickets Repository', () => {
    it('fetchInit updates websiteName', async () => {
      const { tickets } = useSupportData()
      mockFetch.mockResolvedValue({ success: true, data: { website: { name: 'New Support' } } })
      await tickets.fetchInit()
      expect(tickets.websiteName.value).toBe('New Support')
    })

    it('fetchTemplates returns fallbacks on error', async () => {
      const { tickets } = useSupportData()
      mockFetch.mockRejectedValue(new Error('Fail'))
      const res = await tickets.fetchTemplates()
      expect(res).toHaveLength(2)
      expect(res[0].id).toBe('t1')
    })

    it('createTicket handles success without files', async () => {
      const { tickets } = useSupportData()
      mockFetch.mockResolvedValue({ success: true })
      const res = await tickets.createTicket({ 
        email: 'a@b.c', title: 'T', templateId: '1', answers: {} 
      })
      expect(res.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith('/api/vicket/tickets', expect.objectContaining({
        method: 'POST'
      }))
    })

    it('fetchTicketThread handles expired tokens specifically', async () => {
      const { tickets } = useSupportData()
      mockFetch.mockResolvedValue({ success: false, error_code: 'ticket-link-expired' })
      await expect(tickets.fetchTicketThread('tok')).rejects.toThrow('expired')
    })

    it('sendReply handles expired tokens', async () => {
      const { tickets } = useSupportData()
      mockFetch.mockResolvedValue({ success: false, error_code: 'ticket-link-expired' })
      await expect(tickets.sendReply('tok', 'msg', [])).rejects.toThrow('expired')
    })
  })
})
