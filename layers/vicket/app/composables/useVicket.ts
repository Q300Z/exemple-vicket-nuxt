import { HttpClient } from '../utils/http.client'

/* ── Types (ISP) ── */
export type TemplateOption = { id: string, label: string, value: string }
export type TemplateQuestion = {
  id: string
  label: string
  type: 'TEXT' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'DATE' | 'FILE'
  required: boolean
  order: number
  options?: TemplateOption[]
}
export type Template = { id: string, name: string, description: string, questions: TemplateQuestion[] }

export type ArticleSummary = { id: string, title: string, slug: string, category?: string }
export type ArticleContent = { id: string, content: string }
export type ArticleFull = ArticleSummary & ArticleContent
export type Article = ArticleFull

export type Faq = { id: string, question: string, answer: string }

export type SupportInitResponse = {
  success: boolean
  data?: {
    website?: { name?: string }
    templates: Template[]
    articles?: ArticleSummary[]
    faqs?: Faq[]
  }
  error?: string
}

export type Attachment = { id: string, original_filename: string, url: string }
export type Message = {
  id: string
  content: string
  author_type: 'reporter' | 'agent' | 'system'
  created_at: string
  attachments?: Attachment[]
}
export type TicketAnswer = { id: string, question_label: string, answer: string, attachments?: Attachment[] }
export type TicketThread = {
  id: string
  title: string
  status?: { label: string }
  priority?: { label: string }
  messages: Message[]
  answers?: TicketAnswer[]
}

/* ── Constants ── */
export const PROXY_BASE = '/api/vicket'
export const AUTHOR_LABELS: Record<string, string> = {
  reporter: 'You',
  agent: 'Support',
  system: 'System'
}
export const initialFormValues = { email: '', title: '', answers: {} }

/* ── Domain Service (SRP/DIP) ── */
/**
 * Service responsible for Vicket Domain Logic (SRP).
 * Uses HttpClient for transport logic.
 */
export class VicketApiService {
  private client: HttpClient

  constructor(client: HttpClient) {
    this.client = client
  }

  async fetchInit() {
    const res = await this.client.get<SupportInitResponse>('init')
    if (!res.success || !res.data) throw new Error(res.error || 'Failed to load support data.')
    return res.data
  }

  async createTicket(body: {
    email: string
    title: string
    templateId: string
    answers: Record<string, unknown>
    fileMap?: Record<string, File[]>
  }) {
    const payload = {
      email: body.email,
      title: body.title,
      templateId: body.templateId,
      answers: { ...body.answers }
    }

    let response: { success?: boolean, error?: string, data?: { email_limit_reached?: boolean, warning?: string } }

    if (body.fileMap && Object.keys(body.fileMap).length > 0) {
      const formData = new FormData()
      const normalizedAnswers: Record<string, unknown> = { ...payload.answers }

      for (const [questionId, files] of Object.entries(body.fileMap)) {
        if (files.length > 0) {
          files.forEach(file => formData.append(`files[${questionId}]`, file))
          normalizedAnswers[questionId] = '__isFile:true'
        }
      }

      formData.append('data', JSON.stringify({ ...payload, answers: normalizedAnswers }))
      response = await this.client.post('tickets', formData)
    } else {
      response = await this.client.post('tickets', payload)
    }

    if (!response.success) throw new Error(response.error || 'Failed to create ticket.')
    return {
      emailLimitReached: response.data?.email_limit_reached ?? false,
      warning: response.data?.warning
    }
  }

  async fetchThread(token: string) {
    const res = await this.client.get<{ success?: boolean, error?: string, error_code?: string, data?: TicketThread }>(
      `ticket?token=${encodeURIComponent(token)}`
    )
    if (!res.success || !res.data) {
      if (res.error_code === 'ticket-link-expired') {
        throw new Error('This link has expired. A new secure link has been sent to your email.')
      }
      throw new Error(res.error || 'Failed to load ticket.')
    }
    return res.data
  }

  async sendReply(token: string, content: string, files: File[]) {
    const path = `ticket/messages?token=${encodeURIComponent(token)}`
    let response: { success?: boolean, error?: string, error_code?: string }

    if (files.length > 0) {
      const formData = new FormData()
      formData.append('data', JSON.stringify({ content }))
      files.forEach(file => formData.append('files', file))
      response = await this.client.post(path, formData)
    } else {
      response = await this.client.post(path, { content })
    }

    if (!response.success) {
      if (response.error_code === 'ticket-link-expired') {
        throw new Error('This link has expired. A new secure link has been sent to your email.')
      }
      throw new Error(response.error || 'Failed to send reply.')
    }
  }
}

// Global Singleton Instance (can be replaced by injection in Phase 2 context)
const defaultClient = new HttpClient(PROXY_BASE)
const apiService = new VicketApiService(defaultClient)

/* ── Exported API (Fasade) ── */
export const fetchSupportInit = () => apiService.fetchInit()
export const createTicket = (body: Parameters<VicketApiService['createTicket']>[0]) => apiService.createTicket(body)
export const fetchTicketThread = (token: string) => apiService.fetchThread(token)
export const sendReply = (token: string, content: string, files: File[]) => apiService.sendReply(token, content, files)

/* ── Utils ── */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, 'href="#"')
}
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
  } catch { return iso }
}
export function isFileAnswer(answer: string): boolean {
  return answer?.includes('__isFile:true') || answer?.includes('map[__isFile')
}
export function formatAnswerText(value: string): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const rawItems = trimmed.slice(1, -1).trim()
    return rawItems.length > 0 ? rawItems.split(/\s+/).join(', ') : ''
  }
  return value
}
