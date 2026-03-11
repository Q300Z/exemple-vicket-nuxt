import { miniSearchProvider } from '../../../utils/search'
import { getVicketData } from '../../../utils/vicket'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const category = String(query.category || 'Tous')

  try {
    const data = await getVicketData()
    // Use the Search Provider (LSP: Can be swapped with simpleSearchProvider)
    const articles = await miniSearchProvider.search(data.articles || [], q, category)

    return {
      success: true,
      data: articles
    }
  } catch (error: unknown) {
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})
