import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSupportData } from '../../app/composables/useSupportData'

describe('useSupportData (Repository)', () => {
  const mockFetch = vi.fn()
  const mockUseFetch = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('$fetch', mockFetch)
    vi.stubGlobal('useFetch', mockUseFetch)
    vi.stubGlobal('useState', (key: string, init: () => any) => ref(init()))
  })

  it('fetchInit should call the correct endpoint', async () => {
    mockFetch.mockResolvedValue({ success: true, data: { website: { name: 'Test' }, templates: [] } })
    const repo = useSupportData()
    
    await repo.fetchInit()
    
    expect(mockFetch).toHaveBeenCalledWith('/api/vicket/init')
    expect(repo.websiteName.value).toBe('Test')
  })

  it('fetchArticles should pass correct query params', () => {
    const repo = useSupportData()
    repo.fetchArticles('search-term', 'Technique')
    
    expect(mockUseFetch).toHaveBeenCalledWith('/api/vicket/articles', expect.objectContaining({
      params: { q: 'search-term', category: 'Technique' }
    }))
  })
})
