import type { TicketThread } from '../composables/useVicket'

/**
 * Utility for processing Ticket Thread data (SRP).
 * Keeps the page components focused on orchestration.
 */
export const useTicketProcessor = (thread: Ref<TicketThread | null>) => {
  
  /**
   * Extract the very first message sent by the reporter (The "Problem Description").
   */
  const firstReporterMessage = computed(() => {
    if (!thread.value?.messages) return null
    const sorted = [...thread.value.messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    return sorted.find(m => m.author_type === 'reporter') || null
  })

  /**
   * Returns all messages sorted by date, excluding the first reporter message
   * to avoid redundancy in the UI.
   */
  const sortedMessages = computed(() => {
    if (!thread.value?.messages) return []
    const first = firstReporterMessage.value
    return [...thread.value.messages]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .filter(m => !first || m.id !== first.id)
  })

  /**
   * Filters form answers to only keep non-empty ones or those with attachments.
   */
  const summaryAnswers = computed(() => {
    return thread.value?.answers?.filter(a => a.attachments?.length || a.answer?.trim()) || []
  })

  return {
    firstReporterMessage,
    sortedMessages,
    summaryAnswers
  }
}
