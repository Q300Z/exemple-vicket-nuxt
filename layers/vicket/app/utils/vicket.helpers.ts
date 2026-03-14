/**
 * Industrial helpers for Vicket data formatting (Legacy Sync).
 */

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    .replace(/href\s*=\s*'javascript:[^']*'/gi, 'href=\'#\'')
}

export function isFileAnswer(answer?: string | null): boolean {
  if (!answer) return false
  return answer.includes('__isFile:true') || answer.includes('map[__isFile')
}

/**
 * Formats Vicket bracketed lists [item1 item2] into comma separated strings.
 */
export function formatAnswerText(value?: string | null): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const rawItems = trimmed.slice(1, -1).trim()
    return rawItems.length > 0 ? rawItems.split(/\s+/).join(', ') : ''
  }
  return value
}

/**
 * Sorts Vicket questions by their business 'order' property.
 */
export function sortQuestions<T extends { order?: number }>(questions: T[]): T[] {
  return [...questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function calculateReadingTime(content: string): number {
  if (!content || !content.trim()) return 0
  const wordsPerMinute = 200
  const noHtml = stripHtml(content)
  const words = noHtml.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
