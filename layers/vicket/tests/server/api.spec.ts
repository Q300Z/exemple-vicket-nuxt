import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock globals
vi.stubGlobal('defineEventHandler', vi.fn((handler) => handler))
vi.stubGlobal('getQuery', vi.fn(() => ({})))
vi.stubGlobal('createError', vi.fn((err) => {
  const e = new Error(err.statusMessage || err.message || 'Error')
  ;(e as any).statusCode = err.statusCode || 500
  return e
}))

// Mock the utils modules
vi.mock('../../server/utils/vicket', () => ({
  getVicketData: vi.fn()
}))
vi.mock('../../server/utils/search', () => ({
  miniSearchProvider: {
    search: vi.fn()
  }
}))

describe('Server API Routes', () => {
  let articlesHandler: any
  let articleDetailHandler: any
  let vicketUtils: any
  let searchUtils: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    vicketUtils = await import('../../server/utils/vicket')
    searchUtils = await import('../../server/utils/search')
    
    // Re-import handlers to ensure they use the mocks
    articlesHandler = (await import('../../server/api/vicket/articles/index.get')).default
    articleDetailHandler = (await import('../../server/api/vicket/articles/[slug].get')).default
  })

  it('articles index should return list of articles', async () => {
    const mockArticles = [{ id: '1', title: 'A1', slug: 's1' }]
    vicketUtils.getVicketData.mockResolvedValue({ articles: mockArticles })
    searchUtils.miniSearchProvider.search.mockResolvedValue(mockArticles)

    const response = await articlesHandler({} as any)
    expect(response.success).toBe(true)
    expect(response.data).toHaveLength(1)
  })

  it('article detail should return article if found', async () => {
    const mockArticle = { id: '1', title: 'A1', slug: 's1' }
    vicketUtils.getVicketData.mockResolvedValue({ articles: [mockArticle] })
    
    const event = { context: { params: { slug: 's1' } } } as any
    const response = await articleDetailHandler(event)

    expect(response.success).toBe(true)
    expect(response.data.title).toBe('A1')
  })
})
