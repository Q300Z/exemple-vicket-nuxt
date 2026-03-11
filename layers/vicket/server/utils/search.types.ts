import type { ArticleSummary } from '~/app/composables/useVicket'

/**
 * Interface for Search Providers (LSP).
 * Allows switching between different search engines (MiniSearch, Algolia, etc.)
 */
export interface ISearchProvider {
  /**
   * Performs a search on a collection of articles.
   */
  search(articles: ArticleSummary[], query: string, category?: string): Promise<ArticleSummary[]>
}
