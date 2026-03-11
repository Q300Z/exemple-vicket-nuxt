import { describe, it, expect, vi } from 'vitest'
import { VicketServerTransformer } from '../../server/utils/transformer'

// Mock the highlighter
vi.stubGlobal('highlightCodeServer', vi.fn((content) => Promise.resolve(`highlighted:${content}`)))

describe('VicketServerTransformer', () => {
  it('should enrich multiple articles', async () => {
    const articles = [
      { id: '1', content: 'code1', title: 'T1', slug: 's1' },
      { id: '2', content: 'code2', title: 'T2', slug: 's2' }
    ] as any
    
    const enriched = await VicketServerTransformer.enrichArticles(articles)
    
    expect(enriched[0].content).toBe('highlighted:code1')
    expect(enriched[1].content).toBe('highlighted:code2')
  })

  it('should enrich a single article', async () => {
    const article = { id: '1', content: 'code', title: 'T', slug: 's' } as any
    const enriched = await VicketServerTransformer.enrichArticle(article)
    expect(enriched.content).toBe('highlighted:code')
  })
})
