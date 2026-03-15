import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSupportData } from '../../app/composables/useSupportData'
import { 
  stripHtml, 
  sanitizeHtml, 
  isFileAnswer, 
  formatAnswerText, 
  calculateReadingTime,
  sortQuestions 
} from '../../app/utils/vicket.helpers'

// Mock globally
const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('Vicket Helpers (Industrial Coverage)', () => {
  it('stripHtml should remove all tags', () => {
    expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
  })

  it('sanitizeHtml should remove scripts but keep safe tags', () => {
    const dirty = '<script>alert(1)</script><div onmouseover="bad()">Safe</div>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<script>')
    expect(clean).not.toContain('onmouseover')
    expect(clean).toContain('Safe')
  })

  it('isFileAnswer should detect Vicket file markers', () => {
    expect(isFileAnswer('__isFile:true')).toBe(true)
    expect(isFileAnswer('map[__isFile')).toBe(true)
    expect(isFileAnswer('just text')).toBe(false)
    expect(isFileAnswer(null)).toBe(false)
  })

  it('formatAnswerText should convert bracketed lists', () => {
    expect(formatAnswerText('[one two three]')).toBe('one, two, three')
    expect(formatAnswerText('simple text')).toBe('simple text')
    expect(formatAnswerText('[]')).toBe('')
    expect(formatAnswerText(null)).toBe('')
  })

  it('calculateReadingTime should be accurate', () => {
    const longText = 'word '.repeat(400)
    expect(calculateReadingTime(longText)).toBeGreaterThanOrEqual(2)
    // The current implementation returns 0 for empty string
    expect(calculateReadingTime('')).toBe(0)
  })

  it('sortQuestions should respect business order', () => {
    const q = [{ id: '1', order: 5 }, { id: '2', order: 1 }]
    const sorted = sortQuestions(q as unknown as { id: string, order: number }[])
    expect(sorted[0].id).toBe('2')
  })
})

describe('Support Repository (Deep Logic Coverage)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createTicket should handle Multipart when files are present', async () => {
    const { tickets } = useSupportData()
    mockFetch.mockResolvedValue({ success: true, data: { id: '123', token: 'abc' } })

    const file = new File(['content'], 'test.png', { type: 'image/png' })
    await tickets.createTicket({
      email: 'test@vicket.io',
      title: 'Bug',
      templateId: 'tpl1',
      answers: { q1: 'val1' },
      fileMap: { q2: [file] }
    })

    const call = mockFetch.mock.calls[0]
    expect(call[0]).toBe('/api/vicket/ticket')
    expect(call[1].body instanceof FormData).toBe(true)
    
    const formData = call[1].body as FormData
    expect(formData.get('files[q2]')).toBeDefined()
    const data = JSON.parse(formData.get('data') as string)
    expect(data.answers.q2).toBe('__isFile:true')
  })

  it('fetchTicketThread should handle expired tokens', async () => {
    const { tickets } = useSupportData()
    mockFetch.mockResolvedValue({ success: false, error_code: 'ticket-link-expired' })

    await expect(tickets.fetchTicketThread('expired')).rejects.toThrow('expired')
  })

  it('sendReply should handle files', async () => {
    const { tickets } = useSupportData()
    mockFetch.mockResolvedValue({ success: true })

    const file = new File([''], 'img.jpg')
    await tickets.sendReply('tk1', 'Hello', [file])

    expect(mockFetch.mock.calls[0][1].body instanceof FormData).toBe(true)
  })
})
