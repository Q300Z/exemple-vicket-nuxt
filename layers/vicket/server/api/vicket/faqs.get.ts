import { getVicketData } from '../../utils/vicket'

export default defineEventHandler(async () => {
  try {
    const data = await getVicketData()
    return {
      success: true,
      data: data.faqs
    }
  } catch (error: unknown) {
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message
    })
  }
})
