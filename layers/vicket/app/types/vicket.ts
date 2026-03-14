export interface ArticleSummary {
  id: string
  title: string
  slug: string
  category?: string
  type?: 'article' | 'faq'
  content?: string
}

export interface ArticleFull extends ArticleSummary {
  content: string
  category: string
}

export interface TicketQuestion {
  id: string
  label: string
  type: string
  required: boolean
  options?: { value: string, label: string }[]
}

export interface TicketTemplate {
  id: string
  label: string
  icon?: string
  description?: string
  questions: TicketQuestion[]
}

export interface TicketAttachment {
  id: string
  url: string
  original_filename: string
  mime_type: string
}

export interface TicketMessage {
  id: string
  content: string
  author_type: 'reporter' | 'agent'
  author_name: string
  created_at: string
  attachments?: TicketAttachment[]
}

export interface TicketThread {
  id: string
  token: string
  subject: string
  status: string
  messages: TicketMessage[]
}

export interface SupportInitResponse {
  success: boolean
  data: {
    website?: { name?: string }
    templates: TicketTemplate[]
    articles?: ArticleSummary[]
    faqs?: { question: string, answer: string }[]
  }
}

export type LayoutMode = 'grid' | 'list' | 'minimal'
