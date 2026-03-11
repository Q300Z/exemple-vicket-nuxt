import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock H3 functions BEFORE importing
vi.stubGlobal('getRequestIP', vi.fn(() => '127.0.0.1'))
vi.stubGlobal('createError', vi.fn((err) => {
  const error = new Error(err.statusMessage || 'Error')
  ;(error as any).statusCode = err.statusCode
  return error
}))

describe('Security Utils', () => {
  let checkRateLimit: any
  let checkBodySize: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('../../server/utils/security')
    checkRateLimit = mod.checkRateLimit
    checkBodySize = mod.checkBodySize
  })

  it('checkRateLimit should allow requests within limit', () => {
    const mockEvent = {} as any
    vi.mocked(getRequestIP).mockReturnValueOnce('ip-allowed')
    expect(() => checkRateLimit(mockEvent, 2)).not.toThrow()
  })

  it('checkRateLimit should throw 429 if limit exceeded', () => {
    const mockEvent = {} as any
    vi.mocked(getRequestIP).mockReturnValue('ip-blocked')
    checkRateLimit(mockEvent, 1)
    expect(() => checkRateLimit(mockEvent, 1)).toThrow()
  })

  it('checkBodySize should allow small payloads', () => {
    const mockEvent = { node: { req: { headers: { 'content-length': '100' } } } } as any
    expect(() => checkBodySize(mockEvent, 1000)).not.toThrow()
  })

  it('checkBodySize should throw 413 for large payloads', () => {
    const mockEvent = { node: { req: { headers: { 'content-length': '2000' } } } } as any
    expect(() => checkBodySize(mockEvent, 1000)).toThrow()
  })
})
