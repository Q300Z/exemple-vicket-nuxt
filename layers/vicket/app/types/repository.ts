import type { Ref, ComputedRef, InjectionKey } from 'vue'
import type { AsyncData } from '#app'

import type { ArticleSummary, ArticleFull } from '../composables/useVicket'

/**
 * Interface defining the contract for Support Data operations (DIP).
 */
export interface ISupportRepository {
  websiteName: Ref<string>
  categories: ComputedRef<string[]>

  /**
   * Fetches initial configuration.
   */
  fetchInit(): Promise<unknown>

  /**
   * Fetches a list of article summaries (ISP: Optimized for lists).
   */
  fetchArticles(query?: string, category?: string): AsyncData<{ success: boolean, data: ArticleSummary[] }, unknown>

  /**
   * Fetches a full article by slug.
   */
  fetchArticle(slug: string): AsyncData<{ success: boolean, data: ArticleFull }, unknown>

  /**
   * Fetches frequently asked questions.
   */
  fetchFaqs(): AsyncData<unknown, unknown>

  /**
   * Fetches related article summaries.
   */
  fetchRelatedArticles(currentId: string, limit?: number): AsyncData<ArticleSummary[], unknown>
}

/**
 * Injection Key for the Support Repository.
 */
export const SUPPORT_REPOSITORY_KEY = Symbol('SUPPORT_REPOSITORY') as InjectionKey<ISupportRepository>
