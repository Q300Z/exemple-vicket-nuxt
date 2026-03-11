/**
 * Generic HTTP Client responsible for low-level network operations (SRP).
 * Agnostic of any specific business logic.
 */
export class HttpClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
  }

  /**
   * Performs a generic request.
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        // Generic error parsing
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: response.statusText }
        }
        throw new Error(errorData.error || `HTTP Error ${response.status}`)
      }

      return await response.json() as T
    } catch (err) {
      if (err instanceof Error) throw err
      throw new Error('Unknown network error')
    }
  }

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(path, { method: 'GET', headers })
  }

  async post<T>(path: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
    const isFormData = body instanceof FormData

    const finalHeaders: Record<string, string> = { ...headers }
    if (!isFormData) {
      finalHeaders['Content-Type'] = 'application/json'
    }

    return this.request<T>(path, {
      method: 'POST',
      headers: finalHeaders,
      body: isFormData ? body : JSON.stringify(body)
    })
  }
}
