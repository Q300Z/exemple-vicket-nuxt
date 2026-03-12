import { describe, it, expect } from 'vitest'
import { VicketSearchProvider } from '../../server/utils/search'

describe('Search Providers (KISS)', () => {
  const articles = [
    { id: '1', title: 'How to pay', slug: 'pay', category: 'Billing' },
    { id: '2', title: 'Setup account', slug: 'setup', category: 'Technical' },
    { id: '3', title: 'About us', slug: 'about', category: 'General' }
  ]

  it('VicketSearchProvider should find items by query', async () => {
    const provider = new VicketSearchProvider()
    const results = await provider.search(articles, 'pay')
    expect(results).toHaveLength(1)
    expect(results[0].title).toContain('pay')
  })

  it('VicketSearchProvider should filter by category', async () => {
    const provider = new VicketSearchProvider()
    const results = await provider.search(articles, '', 'Technical')
    expect(results).toHaveLength(1)
    expect(results[0].category).toBe('Technical')
  })

  it('VicketSearchProvider should return all for "Tous"', async () => {
    const provider = new VicketSearchProvider()
    const results = await provider.search(articles, '', 'Tous')
    expect(results).toHaveLength(3)
  })
})
