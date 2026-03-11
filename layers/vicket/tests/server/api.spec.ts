import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('Server API Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('articles index should return mocked articles', async () => {
    const mockArticles = [{ id: '1', title: 'Test Article', slug: 'test' }]

    // Register the internal nitro endpoint mock
    registerEndpoint('/api/vicket/articles', () => ({
      success: true,
      data: mockArticles
    }))

    const response = await $fetch<unknown>('/api/vicket/articles')
    expect(response.success).toBe(true)
    expect(response.data[0].title).toBe('Test Article')
  })
})
