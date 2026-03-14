/**
 * Composable responsible for search history persistence (SRP).
 * Uses cookies instead of localStorage for hydration compatibility (SSR).
 */
export const useSearchHistory = (maxItems = 5, initialHistory?: string[]) => {
  // Use unique key for tests to avoid cross-test contamination
  const stateKey = initialHistory ? `vicket-search-history-state-${Math.random()}` : 'vicket-search-history-state'
  
  const history = useState<string[]>(stateKey, () => {
    if (initialHistory) return initialHistory
    const cookie = useCookie<string[]>('vicket-search-history', {
      default: () => [],
      watch: true,
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    return cookie.value || []
  })

  const syncCookie = () => {
    const cookie = useCookie<string[]>('vicket-search-history')
    cookie.value = history.value
  }

  const addToHistory = (query: string) => {
    const q = query.trim()
    if (!q) return

    const current = [...history.value]

    // Remove if already exists to put it at the top (SRP: list logic)
    const filtered = current.filter(h => h.toLowerCase() !== q.toLowerCase())
    const newHistory = [q, ...filtered].slice(0, maxItems)

    history.value = newHistory
    syncCookie()
  }

  const clearHistory = () => {
    history.value = []
    syncCookie()
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
}
