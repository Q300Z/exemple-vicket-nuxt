/**
 * Composable responsible for local ticket tracking (SRP).
 * Allows users to find their tickets without checking email.
 */
export const useTicketHistory = (maxItems = 10) => {
  const history = useCookie<Array<{ id: string, token: string, title: string, date: string }>>('vicket-ticket-history', {
    default: () => [],
    watch: true,
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  const saveTicket = (ticket: { id: string, token: string, title: string }) => {
    const newEntry = {
      ...ticket,
      date: new Date().toISOString()
    }
    
    const filtered = history.value.filter(t => t.id !== ticket.id)
    history.value = [newEntry, ...filtered].slice(0, maxItems)
  }

  const clearHistory = () => {
    history.value = []
  }

  return {
    ticketHistory: computed(() => history.value),
    saveTicket,
    clearHistory
  }
}
