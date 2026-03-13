import { describe, it, expect } from 'vitest'
import { miniSearchProvider } from '../../server/utils/search'
import type { UnifiedSearchResult } from '../../server/utils/search.types'

const mockItems: UnifiedSearchResult[] = [
  { id: '1', title: 'Installer Vicket', content: 'Guide installation', category: 'General', type: 'article', slug: 'installer' },
  { id: '2', title: 'Facturation', content: 'Paiements et factures', category: 'Billing', type: 'faq', slug: 'facturation' }
]

describe('Server Search Utility', () => {
  it('finds items by title', async () => {
    const results = await miniSearchProvider.search(mockItems, 'Vicket')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].id).toBe('1')
  })

  it('filters by category', async () => {
    const results = await miniSearchProvider.search(mockItems, '', 'Billing')
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('2')
  })
})
