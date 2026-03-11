import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '../../app/utils/http.client'

describe('HttpClient', () => {
  const baseUrl = 'http://api.example.com'
  let client: HttpClient

  beforeEach(() => {
    client = new HttpClient(baseUrl)
    vi.stubGlobal('fetch', vi.fn())
  })

  it('should perform GET request successfully', async () => {
    const mockData = { success: true }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response)

    const result = await client.get('/test')
    
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, expect.objectContaining({ method: 'GET' }))
    expect(result).toEqual(mockData)
  })

  it('should perform POST request with JSON body', async () => {
    const mockData = { id: 1 }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData
    } as Response)

    const result = await client.post('/test', { name: 'Vicket' })
    
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'Vicket' })
    }))
    expect(result).toEqual(mockData)
  })

  it('should handle HTTP errors correctly', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Custom Error' })
    } as Response)

    await expect(client.get('/test')).rejects.toThrow('Custom Error')
  })
})
