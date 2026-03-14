import { SupportInitResponseSchema } from '#vicket/types/vicket'
import type { SupportInitResponse } from '#vicket/types/vicket'
import { serverCache } from './cache'
import { vicketGet } from './http'

const CACHE_KEY = 'init_data'
const CACHE_TTL = 60 // 1 minute

/**
 * Server-side utility to fetch and cache Vicket data (SRP).
 * Now using vicketGet for SOLID architecture.
 */
export const getVicketData = async (): Promise<SupportInitResponse['data']> => {
  // 1. Try Cache (LSP)
  try {
    const cached = await serverCache.get<SupportInitResponse['data']>(CACHE_KEY)
    if (cached) return cached
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[Vicket] Cache error:', e)
  }

  // 2. Fetch via Http Utility (DIP)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawResponse = await vicketGet<any>('init')

    // Contract-First Validation (Zod)
    const response = SupportInitResponseSchema.parse(rawResponse)

    if (!response?.success || !response?.data) {
      throw new Error('Invalid API Response structure')
    }

    // 3. Transformation & Enrichment (SRP)
    if (response.data.articles) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.data.articles = await VicketServerTransformer.enrichArticles(response.data.articles as any)
    }

    // 4. Store in Cache (LSP)
    await serverCache.set(CACHE_KEY, response.data, CACHE_TTL)

    return response.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('[Vicket] Fetch failed or validation error:', e.message)
    
    // Server-side Fallback (Showcase Resilience)
    return {
      website: { name: 'Vicket Showcase' },
      templates: [
        { id: 'f1', name: 'Support Technique', icon: 'i-lucide-wrench', description: 'vicket.api_not_configured', questions: [] },
        { id: 'f2', name: 'Facturation', icon: 'i-lucide-credit-card', description: 'vicket.questions_on_billing', questions: [] }
      ],
      articles: [],
      faqs: [],
      isFallback: true
    }
  }
}
