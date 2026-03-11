import { getVicketData } from '../../utils/vicket'

export default defineEventHandler(async () => {
  try {
    const data = await getVicketData()
    console.log('[Nitro /init] Sending templates count:', data.templates?.length || 0)
    return {
      success: true,
      data: {
        website: data.website,
        templates: data.templates
      }
    }
  } catch (error: unknown) {
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})
