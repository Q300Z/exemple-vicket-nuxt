import { describe, it, expect } from 'vitest'
import { sortQuestions } from '../../app/utils/vicket.helpers'
import type { TicketQuestion } from '../../app/types/vicket'

describe('Vicket Sorting Logic', () => {
  it('should sort questions by order property ascending', () => {
    const questions: Partial<TicketQuestion>[] = [
      { id: 'q1', order: 10, label: 'Last' },
      { id: 'q2', order: 1, label: 'First' },
      { id: 'q3', order: 5, label: 'Middle' }
    ]

    const sorted = sortQuestions(questions as TicketQuestion[])

    expect(sorted[0].id).toBe('q2')
    expect(sorted[1].id).toBe('q3')
    expect(sorted[2].id).toBe('q1')
  })

  it('should handle questions without order by using 0 as default', () => {
    const questions: Partial<TicketQuestion>[] = [
      { id: 'q1', order: 5 },
      { id: 'q2' } // Should be 0
    ]

    const sorted = sortQuestions(questions as TicketQuestion[])
    expect(sorted[0].id).toBe('q2')
  })
})
