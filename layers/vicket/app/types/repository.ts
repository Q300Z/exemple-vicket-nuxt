import type { Ref, ComputedRef, InjectionKey } from 'vue'
import type { AsyncData } from '#app'
import type { ArticleSummary, ArticleFull } from '../composables/useVicket'

export interface SupportFaq {
  id: string
  question: string
  answer: string
}

/**
 * ISP: Repository for Knowledge Base (Articles, Categories, FAQ)
 */
export interface IKnowledgeRepository {
  categories: ComputedRef<string[]>
  fetchArticles(query?: string, category?: string): AsyncData<{ success: boolean, data: ArticleSummary[] }, unknown>
  searchArticles(query?: string, category?: string): Promise<{ success: boolean, data: ArticleSummary[] }>
  fetchArticle(slug: string): AsyncData<{ success: boolean, data: ArticleFull }, unknown>
  fetchFaqs(query?: string): AsyncData<{ success: boolean, data: SupportFaq[] }, unknown>
  fetchRelatedArticles(currentId: string, limit?: number): AsyncData<ArticleSummary[], unknown>
}

/**
 * ISP: Repository for Ticket Operations
 */
export interface ITicketRepository {
  websiteName: Ref<string>
  fetchInit(): Promise<unknown>
  createTicket(payload: Record<string, unknown>): Promise<TicketCreateResponse>
  fetchTemplates(): Promise<TicketTemplate[]>
  fetchTicketThread(token: string): Promise<TicketThread>
  sendReply(token: string, content: string, files: File[]): Promise<void>
}

/**
 * ISP: Repository for User Engagement (Feedbacks, Ratings)
 */
export interface IEngagementRepository {
  submitFeedback(articleId: string, helpful: boolean): Promise<unknown>
}

/**
 * Injection Keys for Decoupled Repositories (DIP)
 * Using Symbol.for to ensure consistent identity across layers and tests.
 */
export const KNOWLEDGE_REPOSITORY_KEY = 'KNOWLEDGE_REPOSITORY' as unknown as InjectionKey<IKnowledgeRepository>
export const TICKET_REPOSITORY_KEY = 'TICKET_REPOSITORY' as unknown as InjectionKey<ITicketRepository>
export const ENGAGEMENT_REPOSITORY_KEY = 'ENGAGEMENT_REPOSITORY' as unknown as InjectionKey<IEngagementRepository>
