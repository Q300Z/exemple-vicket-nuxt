import { describe, it, expect } from 'vitest'
import { MiniSearchProvider, SimpleSearchProvider } from '../../server/utils/search'

describe('Search Providers (LSP)', () => {
  const articles = [
    { id: '1', title: 'How to install', slug: 'install', category: 'General' },
    { id: '2', title: 'Payment issues', slug: 'payment', category: 'Billing' },
    { id: '3', title: 'Technical guide', slug: 'tech', category: 'Technical' }
  ] as any

  it('MiniSearchProvider should find items by query', async () => {
    const provider = new MiniSearchProvider()
    const results = await provider.search(articles, 'payment')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('2')
  })

  it('SimpleSearchProvider should filter by category', async () => {
    const provider = new SimpleSearchProvider()
    const results = await provider.search(articles, '', 'Technical')
    expect(results).toHaveLength(1)
    expect(results[0].category).toBe('Technical')
  })

  it('SimpleSearchProvider should return all for "Tous"', async () => {
    const provider = new SimpleSearchProvider()
    const results = await provider.search(articles, '', 'Tous')
    expect(results).toHaveLength(3)
  })
})
