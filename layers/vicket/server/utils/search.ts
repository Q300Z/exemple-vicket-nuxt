import type { UnifiedSearchResult, ISearchProvider } from './search.types'

/**
 * Single, unified search provider (KISS).
 * Uses MiniSearch internally for fuzzy matching.
 */
export class VicketSearchProvider implements ISearchProvider {
  private index: unknown = null

  private async getIndex(documents: UnifiedSearchResult[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (this.index) return this.index as any

    const MiniSearch = (await import('minisearch')).default
    const index = new MiniSearch({
      fields: ['title', 'category', 'content'], // Index content for deep search
      storeFields: ['id', 'title', 'slug', 'category', 'content', 'type'],
      searchOptions: { 
        fuzzy: 0.2, 
        prefix: true, 
        boost: { title: 3, category: 1.5, content: 1 } 
      }
    })

    index.addAll(documents)
    this.index = index
    return index
  }

  async search(documents: UnifiedSearchResult[], query: string, category = 'Tous'): Promise<UnifiedSearchResult[]> {
    if (!query) {
      const base = category === 'Tous' ? documents : documents.filter(d => d.category === category)
      return base.slice(0, 10)
    }

    const index = await this.getIndex(documents)
    const results = index.search(query, {
      filter: (result: { category: string }) => category === 'Tous' || result.category === category
    })

    return results.slice(0, 10) as unknown as UnifiedSearchResult[]
  }
}

export const miniSearchProvider = new VicketSearchProvider()
