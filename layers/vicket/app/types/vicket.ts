import { z } from 'zod'

/**
 * Zod Schemas for API Validation (Industrial Hardening).
 * Ensures that API contract changes don't break the UI.
 */

export const ArticleSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: z.string().optional(),
  type: z.enum(['article', 'faq']).optional(),
  content: z.string().optional()
})

export const ArticleFullSchema = ArticleSummarySchema.extend({
  content: z.string(),
  category: z.string()
})

export const TicketQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean(),
  order: z.number().default(0), // Added for business sorting
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
})

export const TicketTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(TicketQuestionSchema)
})

export const TicketAttachmentSchema = z.object({
  id: z.string(),
  url: z.string(),
  original_filename: z.string(),
  mime_type: z.string()
})

export const TicketMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  author_type: z.enum(['reporter', 'agent', 'system', 'user']), // Support both 'agent' and 'user'
  author_name: z.string().optional(),
  created_at: z.string(),
  attachments: z.array(TicketAttachmentSchema).optional()
})

export const TicketAnswerSchema = z.object({
  id: z.string(),
  question_label: z.string(),
  answer: z.string().optional(),
  attachments: z.array(TicketAttachmentSchema).optional()
})

export const TicketThreadSchema = z.object({
  id: z.string(),
  token: z.string(),
  subject: z.string(),
  status: z.object({ label: z.string() }).optional(),
  priority: z.object({ label: z.string() }).optional(),
  messages: z.array(TicketMessageSchema),
  answers: z.array(TicketAnswerSchema).optional() // Summary of form answers
})

export const TicketCreateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    email_limit_reached: z.boolean().optional(),
    warning: z.string().optional()
  }).optional()
})

export const SupportInitResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    website: z.object({ name: z.string().optional() }).optional(),
    templates: z.array(TicketTemplateSchema),
    articles: z.array(ArticleSummarySchema).optional(),
    faqs: z.array(z.object({
      id: z.string().optional(),
      question: z.string(),
      answer: z.string()
    })).optional(),
    isFallback: z.boolean().optional()
  })
})

/* ── TypeScript Types (Inferred from Zod) ── */
export type ArticleSummary = z.infer<typeof ArticleSummarySchema>
export type ArticleFull = z.infer<typeof ArticleFullSchema>
export type TicketQuestion = z.infer<typeof TicketQuestionSchema>
export type TicketTemplate = z.infer<typeof TicketTemplateSchema>
export type TicketAttachment = z.infer<typeof TicketAttachmentSchema>
export type TicketMessage = z.infer<typeof TicketMessageSchema>
export type TicketAnswer = z.infer<typeof TicketAnswerSchema>
export type TicketThread = z.infer<typeof TicketThreadSchema>
export type SupportInitResponse = z.infer<typeof SupportInitResponseSchema>
export type TicketCreateResponse = z.infer<typeof TicketCreateResponseSchema>

export type LayoutMode = 'grid' | 'list' | 'minimal'
