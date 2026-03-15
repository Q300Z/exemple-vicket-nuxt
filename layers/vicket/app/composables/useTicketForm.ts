import { z } from 'zod'

/**
 * Composable handling ticket form schema generation (SRP/OCP).
 * Maps Vicket field types to Zod schemas.
 */
export const useTicketForm = () => {
  const { t } = useI18n()

  const createTicketSchema = (fields: TicketField[] = [], customValidators: Record<string, z.ZodTypeAny> = {}) => {
    const shape: Record<string, z.ZodTypeAny> = {}

    if (!Array.isArray(fields)) return z.object({})

    for (const field of fields) {
      // 1. Check for custom validator (DI / OCP)
      if (customValidators[field.id]) {
        shape[field.id] = customValidators[field.id]
        continue
      }

      const type = field.type?.toUpperCase()
      let schema: z.ZodTypeAny = z.string()

      // 2. Base Schema by Type
      if (type === 'CHECKBOX' || type === 'CHECKBOXES' || type === 'MULTI_SELECT') {
        schema = z.array(z.string())
        if (field.required) {
          schema = (schema as z.ZodArray<z.ZodString>).min(1, t('vicket.validation.required_choice'))
        } else {
          schema = schema.optional().default([])
        }
      } else if (type === 'FILE') {
        schema = z.any()
        if (field.required) {
          schema = schema.refine(val => !!val, t('vicket.validation.required_file'))
        } else {
          schema = schema.optional().nullable()
        }
      } else if (field.id === 'email') {
        schema = z.string().email(t('vicket.validation.invalid_email'))
        if (field.required) {
          schema = (schema as z.ZodString).min(1, t('vicket.validation.required_field'))
        } else {
          schema = schema.optional().or(z.literal(''))
        }
      } else {
        // Generic string fields (Text, Textarea, Select, Date)
        schema = z.string()
        if (field.required) {
          schema = (schema as z.ZodString).min(1, t('vicket.validation.required_field'))
        } else {
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
