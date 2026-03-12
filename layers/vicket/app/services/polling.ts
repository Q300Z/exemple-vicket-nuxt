import { BrowserNotificationProvider } from './notifications'

/**
 * Headless Ticket Polling (SRP / DIP).
 * Monitors for new messages and triggers external notifications if hidden.
 */
export const useTicketPolling = (token: Ref<string>, onUpdate: (data: TicketThread) => void) => {
  const isPolling = ref(false)
  const notificationProvider = new BrowserNotificationProvider()
  let timer: ReturnType<typeof setInterval> | null = null

  const checkUpdates = async () => {
    try {
      const data = await fetchTicketThread(token.value)
      onUpdate(data)

      // Notify if new agent message and tab is hidden (UX)
      if (document.visibilityState === 'hidden' && data.messages) {
        const lastMsg = data.messages[data.messages.length - 1]
        if (lastMsg.author_type === 'agent') {
          await notificationProvider.notify(
            'Support Vicket', 
            `Nouveau message : ${lastMsg.content.substring(0, 50)}...`,
            { icon: '/favicon.ico' }
          )
        }
      }
    } catch (e) {
      console.error('Polling error', e)
    }
  }

  const startPolling = () => {
    if (timer) return
    isPolling.value = true
    timer = setInterval(() => {
      void checkUpdates()
    }, 15000) // Poll every 15s
  }

  const stopPolling = () => {
    if (timer) clearInterval(timer)
    timer = null
    isPolling.value = false
  }

  onUnmounted(stopPolling)

  return { isPolling, startPolling, stopPolling }
}
