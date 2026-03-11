/**
 * Utility responsible for data transformation between UI state and Vicket API (SRP).
 */
export const VicketDataTransformer = {
  /**
   * Transforms raw form state into a structured Vicket ticket payload.
   */
  toCreateTicketPayload(
    state: Record<string, unknown>,
    questions: { id: string, type: string }[],
    buckets: Record<string, File[]>
  ) {
    const answers: Record<string, unknown> = {}
    const fileMap: Record<string, File[]> = {}

    questions.forEach((q) => {
      if (q.type === 'FILE') {
        if (buckets[q.id]) {
          fileMap[q.id] = buckets[q.id]
        }
      } else {
        answers[q.id] = state[q.id]
      }
    })

    return {
      email: state.email as string,
      title: state.title as string,
      answers,
      fileMap
    }
  }
}
