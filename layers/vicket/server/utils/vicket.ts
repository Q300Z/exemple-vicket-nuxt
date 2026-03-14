import type { SupportInitResponse } from '../app/types/vicket'
import { serverCache } from './cache'

const CACHE_KEY = 'init_data'
const CACHE_TTL = 60 // 1 minute

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Server-side utility to fetch and cache Vicket data (SRP).
 * Uses interchangeable Cache Provider (LSP).
 */
export const getVicketData = async (): Promise<SupportInitResponse['data']> => {
  // 1. Try to get from Cache (LSP)
  try {
    const cached = await serverCache.get<SupportInitResponse['data']>(CACHE_KEY)
    if (cached) return cached
  } catch (e) {
    console.error('[Vicket] Cache error:', e)
  }

  // Use runtime config for better security and flexibility
  const config = useRuntimeConfig()
  const apiUrl = (config.vicketApiUrl as string || config.public.vicketApiUrl as string || '').replace(/\/+$/, '')
  const apiKey = config.vicketApiKey as string || config.public.vicketApiKey as string

  // ⚠️ FALLBACK SI VARIABLES MANQUANTES ⚠️
  if (!apiUrl || !apiKey) {
    console.error('[Vicket] Missing credentials, using server-side fallback.')
    return {
      website: { name: 'Vicket Showcase (Fallback)' },
      templates: [
        { id: 'f1', label: 'Support Technique', icon: 'i-lucide-wrench', description: 'API non configurée', questions: [] }
      ],
      articles: [],
      faqs: []
    }
  }

  // 2. Fetch from Remote
  try {
    const response = await $fetch<SupportInitResponse>(`${apiUrl}/public/support/init`, {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response?.success || !response?.data) {
      throw new Error(response?.error || 'Invalid API Response structure')
    }

    // 3. Pre-process data (Highlighter & IDs) on the server (SRP)
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
    console.error('[Vicket] Fetch failed:', e.message)
    // Ne pas laisser l'application planter en prod (KISS)
    return {
      website: { name: 'Vicket Showcase' },
      templates: [
        { id: 'f1', label: 'Support Technique', icon: 'i-lucide-wrench', description: 'API temporairement indisponible', questions: [] }
      ],
      articles: [],
      faqs: []
    }
  }
}
