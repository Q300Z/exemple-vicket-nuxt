import { describe, it, expect } from 'vitest'
import { VicketDataTransformer } from '../../app/utils/vicket.transformer'

describe('VicketDataTransformer', () => {
  it('should transform form state to ticket payload correctly', () => {
    const state = {
      email: 'test@example.com',
      title: 'Support Request',
      q1: 'Answer 1'
    }
    const questions = [
      { id: 'q1', type: 'TEXT' },
      { id: 'q2', type: 'FILE' }
    ]
    const mockFile = new File([''], 'test.png')
    const buckets = {
      q2: [mockFile]
    }

    const payload = VicketDataTransformer.toCreateTicketPayload(state, questions, buckets)

    expect(payload.email).toBe('test@example.com')
    expect(payload.title).toBe('Support Request')
    expect(payload.answers.q1).toBe('Answer 1')
    expect(payload.fileMap.q2).toContain(mockFile)
  })
})
