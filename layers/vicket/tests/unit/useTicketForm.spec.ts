import { describe, it, expect } from 'vitest'
import { useTicketForm } from '../../app/composables/useTicketForm'

describe('useTicketForm', () => {
  const { createTicketSchema } = useTicketForm()

  it('generates a schema for text questions', () => {
    const questions = [
      { id: 'q1', label: 'Name', type: 'TEXT', required: true, order: 0 }
    ]
    const schema = createTicketSchema(questions as { id: string, label: string, required: boolean, type: string }[])
    
    // Valid data
    expect(schema.safeParse({ q1: 'John' }).success).toBe(true)
    // Invalid data (required)
    expect(schema.safeParse({ q1: '' }).success).toBe(false)
  })

  it('generates a schema for email questions', () => {
    const questions = [
      { id: 'email', label: 'Email', type: 'email', required: true, order: 0 }
    ]
    const schema = createTicketSchema(questions as { id: string, label: string, required: boolean, type: string }[])
    
    expect(schema.safeParse({ email: 'test@example.com' }).success).toBe(true)
    expect(schema.safeParse({ email: 'invalid-email' }).success).toBe(false)
  })

  it('handles optional fields correctly', () => {
    const questions = [
      { id: 'q1', label: 'Opt', type: 'TEXT', required: false, order: 0 }
    ]
    const schema = createTicketSchema(questions as { id: string, label: string, required: boolean, type: string }[])
    
    expect(schema.safeParse({ q1: '' }).success).toBe(true)
    expect(schema.safeParse({}).success).toBe(true)
  })

  it('returns an empty object schema if no questions provided', () => {
    const schema = createTicketSchema([])
    expect(schema.safeParse({}).success).toBe(true)
  })
})
