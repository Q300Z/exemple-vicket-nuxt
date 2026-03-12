import type { ArticleSummary } from '~/app/composables/useVicket'
import type { ISearchProvider } from './search.types'

/**
 * Single, unified search provider (KISS).
 * Uses MiniSearch internally for fuzzy matching.
 */
export class VicketSearchProvider implements ISearchProvider {
  private index: unknown = null

  private async getIndex(articles: ArticleSummary[]) {
    if (this.index) return this.index

    const MiniSearch = (await import('minisearch')).default
    const index = new MiniSearch({
      fields: ['title', 'category'],
      storeFields: ['id', 'title', 'slug', 'category'],
      searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 2 } }
    })

    index.addAll(articles)
    this.index = index
    return index
  }

  async search(articles: ArticleSummary[], query: string, category = 'Tous'): Promise<ArticleSummary[]> {
    if (!query) {
      return category === 'Tous' ? articles : articles.filter(a => a.category === category)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index: any = await this.getIndex(articles)
    const results = index.search(query, {
      filter: (result: { category: string }) => category === 'Tous' || result.category === category
    })

    return results as unknown as ArticleSummary[]
  }
}

export const miniSearchProvider = new VicketSearchProvider()
