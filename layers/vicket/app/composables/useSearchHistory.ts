/**
 * Composable responsible for search history persistence (SRP).
 * Uses cookies instead of localStorage for hydration compatibility (SSR).
 */
export const useSearchHistory = (maxItems = 3) => {
  // useCookie is shared between client and server (Isomorphic)
  const history = useCookie<string[]>('vicket-search-history', {
    default: () => [],
    watch: true,
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  const addToHistory = (query: string) => {
    const q = query.trim()
    if (!q) return

    const current = history.value || []

    // Remove if already exists to put it at the top (SRP: list logic)
    const filtered = current.filter(h => h.toLowerCase() !== q.toLowerCase())
    const newHistory = [q, ...filtered].slice(0, maxItems)

    history.value = newHistory
  }

  const clearHistory = () => {
    history.value = []
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
}
