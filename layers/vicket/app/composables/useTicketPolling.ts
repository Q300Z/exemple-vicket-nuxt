/**
 * Composable responsible for background ticket thread polling (SRP).
 * Optimizes resources by stopping when tab is hidden.
 */
export const useTicketPolling = (token: Ref<string>, onUpdate: (data: TicketThread) => void, intervalMs = 30000) => {
  const isPolling = ref(false)
  const lastFetch = ref<Date | null>(null)
  const errorCount = ref(0)

  const { paused } = useIntervalFn(async () => {
    if (!token.value || !isPolling.value) return

    try {
      const data = await fetchTicketThread(token.value)
      onUpdate(data)
      lastFetch.value = new Date()
      errorCount.value = 0
    } catch (e) {
      errorCount.value++
      console.error('[Polling] Error fetching update:', e)

      // Stop polling if too many consecutive errors (SRP: stability logic)
      if (errorCount.value > 5) {
        stopPolling()
      }
    }
  }, intervalMs, { immediate: false })

  const startPolling = () => {
    isPolling.value = true
    paused.value = false
  }

  const stopPolling = () => {
    isPolling.value = false
    paused.value = true
  }

  // Visibility optimization: stop polling if user leaves the tab
  if (import.meta.client) {
    useEventListener(document, 'visibilitychange', () => {
      if (document.hidden) {
        paused.value = true
      } else if (isPolling.value) {
        paused.value = false
      }
    })
  }

  onUnmounted(() => stopPolling())

  return {
    isPolling,
    lastFetch,
    startPolling,
    stopPolling
  }
}
