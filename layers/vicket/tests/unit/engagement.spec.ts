import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSupportData } from '../../app/composables/useSupportData'

// Mock $fetch globally
const mockFetch = vi.fn()
global.$fetch = mockFetch

describe('Engagement Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should submit positive feedback to the correct endpoint', async () => {
    const { engagement } = useSupportData()
    mockFetch.mockResolvedValue({ success: true })

    await engagement.submitFeedback('article-123', true)

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/vicket/article/article-123/feedback',
      expect.objectContaining({
        method: 'POST',
        body: { helpful: true }
      })
    )
  })

  it('should submit negative feedback to the correct endpoint', async () => {
    const { engagement } = useSupportData()
    mockFetch.mockResolvedValue({ success: true })

    await engagement.submitFeedback('article-456', false)

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/vicket/article/article-456/feedback',
      expect.objectContaining({
        method: 'POST',
        body: { helpful: false }
      })
    )
  })
})
