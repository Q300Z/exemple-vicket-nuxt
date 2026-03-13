import { z } from 'zod'

/**
 * Composable handling ticket form schema generation (SRP/OCP).
 * Maps Vicket field types to Zod schemas.
 */
export const useTicketForm = () => {
  const createTicketSchema = (fields: TicketField[] = []) => {
    const shape: Record<string, z.ZodTypeAny> = {}

    if (!Array.isArray(fields)) return z.object({})

    for (const field of fields) {
      let schema: z.ZodTypeAny = z.string()

      if (field.required) {
        schema = (schema as z.ZodString).min(1, 'Ce champ est requis')
      } else {
        schema = (schema as z.ZodString).optional().or(z.literal(''))
      }

      // Handle specific types
      if (field.type === 'email') {
        schema = z.string().email('Format email invalide')
        if (!field.required) {
          schema = schema.optional().or(z.literal(''))
        }
      }

      shape[field.id] = schema
    }

    return z.object(shape)
  }

  return {
    createTicketSchema
  }
}
