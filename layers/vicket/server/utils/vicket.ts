import type { SupportInitResponse } from '~/app/composables/useVicket'
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
export const getVicketData = async () => {
  // 1. Try to get from Cache (LSP)
  const cached = await serverCache.get(CACHE_KEY)
  if (cached) return cached

  const apiUrl = (process.env.VICKET_API_URL || '').replace(/\/+$/, '')
  const apiKey = process.env.VICKET_API_KEY || ''

  if (!apiUrl || !apiKey) {
    throw new Error('Missing Vicket environment variables.')
  }

  // 2. Fetch from Remote
  const response = await $fetch<SupportInitResponse>(`${apiUrl}/public/support/init`, {
    headers: { 'X-Api-Key': apiKey }
  })

  if (!response?.success || !response?.data) {
    throw new Error(response?.error || 'Failed to fetch from Vicket')
  }

  // 3. Pre-process data (Highlighter & IDs) on the server (SRP)
  if (response.data.articles) {
    response.data.articles = await VicketServerTransformer.enrichArticles(response.data.articles)
  }

  // 4. Store in Cache (LSP)
  await serverCache.set(CACHE_KEY, response.data, CACHE_TTL)

  return response.data
}
