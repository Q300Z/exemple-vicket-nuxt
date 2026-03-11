import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { createTicketSchema } from '../../app/utils/vicket.schemas'

describe('createTicketSchema (OCP)', () => {
  it('should use default validation for required fields', () => {
    const questions = [{ id: 'q1', label: 'Label', required: true, type: 'TEXT' }]
    const schema = createTicketSchema(questions)

    const result = schema.safeParse({ email: 'test@test.com', title: 'Title', q1: '' })
    expect(result.success).toBe(false)
  })

  it('should allow overriding validation with custom validators', () => {
    const questions = [{ id: 'q1', label: 'Label', required: true, type: 'TEXT' }]
    // Custom validator: q1 must be exactly 'Vicket'
    const customValidators = {
      q1: z.string().refine(val => val === 'Vicket', { message: 'Must be Vicket' })
    }

    const schema = createTicketSchema(questions, customValidators)

    // Default would pass if not empty, but here it must be 'Vicket'
    const resultInvalid = schema.safeParse({ email: 'test@test.com', title: 'Title', q1: 'Something else' })
    expect(resultInvalid.success).toBe(false)
    if (!resultInvalid.success) {
      expect(resultInvalid.error.issues[0].message).toBe('Must be Vicket')
    }

    const resultValid = schema.safeParse({ email: 'test@test.com', title: 'Title', q1: 'Vicket' })
    expect(resultValid.success).toBe(true)
  })
})
