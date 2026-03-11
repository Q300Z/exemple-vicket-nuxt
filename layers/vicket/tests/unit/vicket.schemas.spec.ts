import { describe, it, expect } from 'vitest'
import { IdentificationSchema, createTicketSchema } from '../../app/utils/vicket.schemas'

describe('Vicket Schemas', () => {
  describe('IdentificationSchema', () => {
    it('should validate correct email', () => {
      const result = IdentificationSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = IdentificationSchema.safeParse({ email: 'invalid-email' })
      expect(result.success).toBe(false)
    })
  })

  describe('createTicketSchema', () => {
    const mockQuestions = [
      { id: 'q1', label: 'Nom', required: true, type: 'TEXT' },
      { id: 'q2', label: 'Optional', required: false, type: 'TEXT' }
    ]
    const schema = createTicketSchema(mockQuestions)

    it('should validate if all required fields are present', () => {
      const data = {
        email: 'user@example.com',
        title: 'Problem with my account',
        q1: 'John Doe'
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject if a required dynamic field is missing', () => {
      const data = {
        email: 'user@example.com',
        title: 'Help'
        // q1 is missing
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
