import MiniSearch from 'minisearch'
import type { ArticleSummary } from '~/app/composables/useVicket'
import type { ISearchProvider } from './search.types'

/**
 * Advanced search implementation using MiniSearch (LSP/SRP).
 * Provides fuzzy matching and relevance scoring.
 */
export class MiniSearchProvider implements ISearchProvider {
  private index: MiniSearch<ArticleSummary> | null = null

  private getIndex(articles: ArticleSummary[]) {
    if (this.index) return this.index

    this.index = new MiniSearch({
      fields: ['title', 'category'],
      storeFields: ['id', 'title', 'slug', 'category'],
      searchOptions: {
        fuzzy: 0.2,
        prefix: true,
        boost: { title: 2 }
      }
    })

    this.index.addAll(articles)
    return this.index
  }

  async search(articles: ArticleSummary[], query: string, category = 'Tous'): Promise<ArticleSummary[]> {
    if (!query) {
      return category === 'Tous' ? articles : articles.filter(a => a.category === category)
    }

    const index = this.getIndex(articles)
    const results = index.search(query, {
      filter: (result) => {
        if (category === 'Tous') return true
        return (result as { category: string }).category === category
      }
    })

    return results as unknown as ArticleSummary[]
  }
}

/**
 * Lightweight search implementation using basic string matching (LSP/SRP).
 * Good fallback or for environments where MiniSearch is too heavy.
 */
export class SimpleSearchProvider implements ISearchProvider {
  async search(articles: ArticleSummary[], query: string, category = 'Tous'): Promise<ArticleSummary[]> {
    let list = articles

    if (category !== 'Tous') {
      list = list.filter(a => a.category === category)
    }

    if (!query) return list

    const q = query.toLowerCase()
    return list.filter(a =>
      a.title.toLowerCase().includes(q)
      || a.category?.toLowerCase().includes(q)
    )
  }
}

/**
 * Singleton instances for performance.
 */
export const miniSearchProvider = new MiniSearchProvider()
export const simpleSearchProvider = new SimpleSearchProvider()
