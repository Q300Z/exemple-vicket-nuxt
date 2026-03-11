export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  try {
    const data = await getVicketData()
    const article = data.articles?.find(a => a.slug === slug)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    return {
      success: true,
      data: article
    }
  } catch (error: unknown) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
