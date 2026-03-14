/**
 * Composable handling content transformation logic (SRP).
 */
export const useContent = () => {
  /**
   * Basic HTML sanitization to keep things safe (SRP).
   * Note: In a real app, use DOMPurify or similar.
   */
  const sanitize = (html: string) => {
    if (!html) return ''
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+(=[^\s>]+)?/gi, '') // More robust event handler removal
  }

  /**
   * Strips HTML tags for previews (SRP).
   */
  const stripHtml = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '')
  }

  /**
   * Formats answer text for display.
   */
  const formatAnswerText = (val: unknown) => {
    if (Array.isArray(val)) return (val as string[]).join(', ')
    return String(val || '')
  }

  /**
   * Highlights matches of a query by returning segments (SRP).
   * No HTML returned, only data structure.
   */
  const highlight = (text: string, query: string) => {
    if (!query || !query.trim() || !text) {
      return [{ text, match: false }]
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    const parts = text.split(regex)

    return parts.map(part => ({
      text: part,
      match: part.toLowerCase() === query.toLowerCase()
    })).filter(p => p.text.length > 0)
  }

  /**
   * Parses HTML to extract headings for a TOC (SRP).
   */
  const extractHeadings = (html: string) => {
    if (!html) return []
    // Matches <h2> and <h3>
    const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi
    const headings: { id: string, text: string, depth: number }[] = []

    let match
    while ((match = regex.exec(html)) !== null) {
      const text = match[2].replace(/<[^>]*>/g, '')
      const id = text.toLowerCase().replace(/[^\w]+/g, '-')
      headings.push({ id, text, depth: parseInt(match[1]) })
    }

    return headings
  }

  return {
    sanitize,
    stripHtml,
    formatAnswerText,
    highlight,
    extractHeadings
  }
}
