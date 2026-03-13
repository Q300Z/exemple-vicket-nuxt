import { miniSearchProvider } from '../../../utils/search'
import { getVicketData } from '../../../utils/vicket'
import type { UnifiedSearchResult } from '../../../utils/search.types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const category = String(query.category || 'Tous')

  try {
    const data = await getVicketData()
    
    // 1. Prepare unified documents (Articles + FAQs)
    const documents: UnifiedSearchResult[] = [
      ...(data.articles || []).map(a => ({ ...a, type: 'article' as const })),
      ...(data.faqs || []).map((f, index) => ({ 
        id: `faq-${index}`, 
        title: f.question, 
        content: f.answer, 
        slug: 'faqs', 
        category: 'FAQ',
        type: 'faq' as const 
      }))
    ]

    // 2. Perform Unified Search
    const results = await miniSearchProvider.search(documents, q, category)

    return {
      success: true,
      data: results
    }
  } catch (error: unknown) {
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})
