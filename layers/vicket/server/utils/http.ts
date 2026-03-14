import { createError } from 'h3'

/**
 * Industrial-grade HTTP Utility for Vicket (SRP).
 * Encapsulates authentication, base URL and unified error handling.
 */

const getVicketConfig = () => {
  const config = useRuntimeConfig()
  const apiUrl = (config.public?.vicketApiUrl as string || process.env.NUXT_PUBLIC_VICKET_API_URL || process.env.VICKET_API_URL || 'https://api.vicket.app/api/v1').replace(/\/+$/, '')
  const apiKey = (config.public?.vicketApiKey as string || process.env.NUXT_PUBLIC_VICKET_API_KEY || process.env.VICKET_API_KEY || '').trim()
  
  return { apiUrl, apiKey }
}

/**
 * Universal request handler.
 */
export const vicketRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const { apiUrl, apiKey } = getVicketConfig()

  if (!apiKey || apiKey === '' || apiKey === 'your_vicket_api_key_here') {
    throw createError({ statusCode: 401, statusMessage: 'Vicket API Key missing (NUXT_PUBLIC_VICKET_API_KEY)' })
  }

  const url = `${apiUrl}/public/support/${path.replace(/^\/+/, '')}`
  const headers = {
    'X-Api-Key': apiKey,
    'Accept': 'application/json',
    ...options.headers
  } as Record<string, string>

  // Auto-detect JSON
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, { ...options, headers })
    const text = await response.text()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: data?.error || `Vicket API Error: ${response.statusText}`,
        data: text
      })
    }

    return data as T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 502,
      statusMessage: `Vicket Connection Failed: ${error.message}`
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const vicketGet = <T>(path: string, query?: Record<string, any>) => {
  const queryString = query ? '?' + new URLSearchParams(query).toString() : ''
  return vicketRequest<T>(path + queryString, { method: 'GET' })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const vicketPost = <T>(path: string, body: any) => {
  const isFormData = body instanceof FormData
  return vicketRequest<T>(path, {
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body)
  })
}
