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
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const shape: Record<string, z.ZodTypeAny> = {
    title: z.string().trim().min(3, 'Le sujet doit faire au moins 3 caractères').max(100, 'Sujet trop long'),
    email: z.string().trim().email('Email invalide')
  }

  questions.forEach((q) => {
    if (customValidators[q.id]) {
      shape[q.id] = customValidators[q.id]
      return
    }

    const type = q.type?.toUpperCase()
    const isArrayType = type === 'CHECKBOXES' || type === 'MULTI_SELECT'
    const isBooleanType = type === 'CHECKBOX'

    if (isArrayType) {
      const base = z.array(z.string())
      shape[q.id] = q.required 
        ? base.min(1, `Veuillez sélectionner au moins une option pour "${q.label}"`)
        : base.default([])
    } else if (isBooleanType) {
      shape[q.id] = q.required
        ? z.boolean().refine(val => val === true, `Le champ "${q.label}" doit être coché`)
        : z.boolean().optional()
    } else if (type === 'FILE') {
      // Stricter File Validation
      const base = z.any().refine((files) => {
        if (!files) return true
        const fileList = Array.isArray(files) ? files : [files]
        return fileList.every(file => file instanceof File && file.size <= MAX_FILE_SIZE)
      }, 'Le fichier est trop lourd (max 10 Mo) ou invalide')

      shape[q.id] = q.required
        ? base.refine(val => !!val && (Array.isArray(val) ? val.length > 0 : true), `Le fichier pour "${q.label}" est requis`)
        : base.optional()
    } else {
      // Automatic trimming for all text-like fields
      const base = z.string().trim()
      shape[q.id] = q.required
        ? base.min(1, `Le champ "${q.label}" est requis`)
        : z.union([z.string().trim(), z.array(z.string()), z.null()]).optional()
    }
  })

  return z.object(shape)
}
