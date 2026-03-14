import { describe, it, expect } from 'vitest'
import { IdentificationSchema, createTicketSchema } from '../../app/utils/vicket.schemas'

describe('Vicket Zod Schemas', () => {
  it('validates a correct email in IdentificationSchema', () => {
    const data = { email: 'test@example.com' }
    const result = IdentificationSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('fails on invalid email in IdentificationSchema', () => {
    const data = { email: 'invalid-email' }
    const result = IdentificationSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('creates and validates a ticket schema with questions', () => {
    const questions = [
      { id: 'q1', label: 'Field 1', required: true, type: 'text' }
    ]
    const schema = createTicketSchema(questions)
    
    // Correct data
    const validData = { title: 'Test Issue', email: 'test@test.com', q1: 'Value' }
    expect(schema.safeParse(validData).success).toBe(true)
    
    // Missing required field
    const invalidData = { title: 'Test Issue', email: 'test@test.com' }
    expect(schema.safeParse(invalidData).success).toBe(false)
  })

  it('handles boolean checkbox correctly', () => {
    const questions = [
      { id: 'q1', label: 'Agree', required: true, type: 'CHECKBOX' }
    ]
    const schema = createTicketSchema(questions)
    
    const validData = { title: 'Test Title', email: 'a@b.com', q1: true }
    expect(schema.safeParse(validData).success).toBe(true)

    const invalidData = { title: 'Test Title', email: 'a@b.com', q1: false } // Required checkbox must be true
    expect(schema.safeParse(invalidData).success).toBe(false)
  })

  it('handles array checkboxes correctly', () => {
    const questions = [
      { id: 'q1', label: 'Choices', required: true, type: 'CHECKBOXES' }
    ]
    const schema = createTicketSchema(questions)
    
    const validData = { title: 'Test Title', email: 'a@b.com', q1: ['opt1', 'opt2'] }
    expect(schema.safeParse(validData).success).toBe(true)
  })
})
