import { defineEventHandler, getQuery, readBody, readMultipartFormData, getMethod, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const apiUrl = (process.env.VICKET_API_URL || '').replace(/\/+$/, '')
  const apiKey = process.env.VICKET_API_KEY || ''

  if (!apiUrl || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing VICKET_API_URL or VICKET_API_KEY environment variable.'
    })
  }

  const path = event.context.params?.path || ''
  const method = getMethod(event)
  const query = getQuery(event)

  // Build target URL with query params
  const queryString = new URLSearchParams(
    Object.entries(query).reduce<Record<string, string>>((acc, [k, v]) => {
      if (v !== undefined && v !== null) acc[k] = String(v)
      return acc
    }, {})
  ).toString()
  const targetUrl = `${apiUrl}/public/support/${path}${queryString ? `?${queryString}` : ''}`

  // Determine content type from the incoming request
  const contentType = event.node.req.headers['content-type'] || ''
  const isMultipart = contentType.includes('multipart/form-data')

  let fetchOptions: RequestInit

  if (method === 'GET' || method === 'HEAD') {
    fetchOptions = {
      method,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    }
  } else if (isMultipart) {
    const parts = await readMultipartFormData(event)
    const formData = new FormData()

    if (parts) {
      for (const part of parts) {
        if (part.name) {
          if (part.filename) {
            const blob = new Blob([part.data], { type: part.type || 'application/octet-stream' })
            formData.append(part.name, blob, part.filename)
          } else {
            formData.append(part.name, part.data.toString('utf-8'))
          }
        }
      }
    }

    fetchOptions = {
      method,
      headers: {
        'X-Api-Key': apiKey
      },
      body: formData
    }
  } else {
    const body = await readBody(event)
    fetchOptions = {
      method,
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    }
  }

  try {
    const response = await fetch(targetUrl, fetchOptions)
    const responseText = await response.text()

    // Set status code early
    event.node.res.statusCode = response.status

    // Check if response is JSON
    const isJsonResponse = response.headers.get('content-type')?.includes('application/json')

    if (isJsonResponse) {
      try {
        const payload = JSON.parse(responseText)

        // --- ENHANCEMENT: Server-side Rendering / Transformation (SRP Layer) ---
        if (payload.success && payload.data) {
          // 1. Process Articles in /init
          if (Array.isArray(payload.data.articles)) {
            for (const article of payload.data.articles) {
              if (article.content) {
                article.content = await highlightCodeServer(article.content)
              }
            }
          }
          // 2. Process Messages in /ticket thread
          if (Array.isArray(payload.data.messages)) {
            for (const message of payload.data.messages) {
              if (message.content) {
                message.content = await highlightCodeServer(message.content)
              }
            }
          }
        }
        // -----------------------------------------------------------------------

        return payload
      } catch {
        // If it fails to parse but was supposed to be JSON, return as is or error
        return { success: false, error: 'Invalid JSON response from Vicket API', raw: responseText }
      }
    }

    // If not JSON (like "Invalid API Key" plain text)
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Vicket API Error: ${responseText.trim() || response.statusText}`,
        data: responseText
      })
    }

    return responseText
  } catch (error: unknown) {
    // Re-throw H3 errors
    if (error && typeof error === 'object' && 'statusCode' in error) throw error

    throw createError({
      statusCode: 502,
      statusMessage: `Failed to fetch from Vicket API: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
})
