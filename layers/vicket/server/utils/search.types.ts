import type { ArticleSummary } from '../app/types/vicket'

export type UnifiedSearchResult = ArticleSummary & {
  type: 'article' | 'faq'
}

/**
 * Interface for Search Providers (LSP).
 * Allows switching between different search engines (MiniSearch, Algolia, etc.)
 */
export interface ISearchProvider {
  /**
   * Performs a search on a collection of documents.
   */
  search(documents: UnifiedSearchResult[], query: string, category?: string): Promise<UnifiedSearchResult[]>
}
