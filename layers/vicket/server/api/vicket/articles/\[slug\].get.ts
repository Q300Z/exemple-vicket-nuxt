import { getVicketData } from '../../../utils/vicket'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  try {
    const data = await getVicketData()
    const article = data.articles?.find(a => a.slug === slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article non trouvé'
      })
    }

    return {
      success: true,
      data: article
    }
  } catch (error: unknown) {
    const err = error as any
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || err.message
    })
  }
})
