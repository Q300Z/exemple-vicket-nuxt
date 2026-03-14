/**
 * Composable responsible for background ticket thread polling (SRP).
 * Optimizes resources by stopping when tab is hidden.
 * Added Accessibility (A11y) for screen readers on updates.
 */
export const useTicketPolling = (token: Ref<string>, onUpdate: (data: TicketThread) => void, intervalMs = 30000) => {
  const isPolling = ref(false)
  const lastFetch = ref<Date | null>(null)
  const errorCount = ref(0)
  const ticketsRepo = inject(TICKET_REPOSITORY_KEY)

  // A11y: Announcements for screen readers
  const announceUpdate = (message: string) => {
    if (!import.meta.client) return
    const el = document.getElementById('vicket-a11y-announcer')
    if (el) el.textContent = message
  }

  const { paused } = useIntervalFn(async () => {
    if (!token.value || !isPolling.value || !ticketsRepo) return

    try {
      const data = await ticketsRepo.fetchTicketThread(token.value)
      onUpdate(data)
      lastFetch.value = new Date()
      errorCount.value = 0

      // A11y: announce new activity if it's a new message
      announceUpdate('Le ticket a été mis à jour avec de nouveaux messages.')
    } catch (e) {
      errorCount.value++
      console.error('[Polling] Error fetching update:', e)

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
