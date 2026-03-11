/**
 * Generic HTTP Client responsible for low-level network operations (SRP).
 * Agnostic of any specific business logic.
 * Features: Timeouts, Generic Error Parsing, FormData support.
 */
export class HttpClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor(baseUrl: string, timeout = 10000) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.defaultTimeout = timeout
  }

  /**
   * Performs a generic request with timeout support.
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/${path.replace(/^\/+/, '')}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
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
      clearTimeout(timeoutId)
      if (err instanceof Error) {
        if (err.name === 'AbortError') throw new Error('Request timeout')
        throw err
      }
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
