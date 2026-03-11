import type { H3Event } from 'h3'

/**
 * Basic in-memory rate limiter (SRP).
 * Note: Use Redis or similar for production multi-instance apps.
 */
const rateLimitMap = new Map<string, { count: number, reset: number }>()

export const checkRateLimit = (event: H3Event, limit = 50, windowMs = 60000) => {
  const ip = getRequestIP(event) || 'anonymous'
  const now = Date.now()

  const record = rateLimitMap.get(ip) || { count: 0, reset: now + windowMs }

  if (now > record.reset) {
    record.count = 1
    record.reset = now + windowMs
  } else {
    record.count++
  }

  rateLimitMap.set(ip, record)

  if (record.count > limit) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests. Please try again later.'
    })
  }
}

/**
 * Verifies request body size from headers before processing (SRP).
 */
export const checkBodySize = (event: H3Event, maxBytes = 15 * 1024 * 1024) => {
  const contentLength = parseInt(event.node.req.headers['content-length'] || '0')

  if (contentLength > maxBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Request Entity Too Large. Maximum size is 15MB.'
    })
  }
}
