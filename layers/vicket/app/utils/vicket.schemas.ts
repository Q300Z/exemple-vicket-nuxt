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

    const type = q.type?.toUpperCase()
    const isArrayType = type === 'CHECKBOX' || type === 'CHECKBOXES' || type === 'MULTI_SELECT'

    // 2. Default validation logic
    if (isArrayType) {
      const base = z.array(z.string())
      shape[q.id] = q.required 
        ? base.min(1, `Veuillez sélectionner au moins une option pour "${q.label}"`)
        : base.default([])
    } else if (type === 'FILE') {
      const base = z.unknown()
      shape[q.id] = q.required
        ? base.refine(val => !!val, `Le fichier pour "${q.label}" est requis`)
        : base.optional()
    } else {
      const base = z.string()
      shape[q.id] = q.required
        ? base.min(1, `Le champ "${q.label}" est requis`)
        : z.union([z.string(), z.array(z.string()), z.null()]).optional() // Defensive for dynamic fields
    }
  })

  return z.object(shape)
}
