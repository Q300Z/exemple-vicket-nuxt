import { z } from 'zod'
import type { VicketCustomValidators } from '../types/validation'

/**
 * Zod Schemas for Support Forms (SRP).
 * Keeps validation logic out of components.
 */

// Step 1: Identification
export const IdentificationSchema = z.object({
  email: z.string({ required_error: 'L\'email est requis' })
    .min(1, 'L\'email est requis')
    .email('Adresse email invalide')
})

export type IdentificationValues = z.infer<typeof IdentificationSchema>

// Dynamic Form Factory (SRP: Logic to build schema based on template)
export const createTicketSchema = (
  questions: { id: string, label: string, required: boolean, type: string }[],
  customValidators: VicketCustomValidators = {}
) => {
  const shape: Record<string, z.ZodTypeAny> = {
    title: z.string().min(3, 'Le sujet doit faire au moins 3 caractères').max(100, 'Sujet trop long'),
    email: z.string().email()
  }

  questions.forEach((q) => {
    // 1. Check if a custom validator exists for this field (OCP)
    if (customValidators[q.id]) {
      shape[q.id] = customValidators[q.id]
      return
    }

    // 2. Default validation logic
    if (q.required) {
      if (q.type === 'CHECKBOX') {
        shape[q.id] = z.array(z.string()).min(1, `Veuillez sélectionner au moins une option pour "${q.label}"`)
      } else if (q.type === 'FILE') {
        shape[q.id] = z.unknown().refine(val => !!val, `Le fichier pour "${q.label}" est requis`)
      } else {
        shape[q.id] = z.string().min(1, `Le champ "${q.label}" est requis`)
      }
    } else {
      shape[q.id] = z.unknown().optional()
    }
  })

  return z.object(shape)
}
