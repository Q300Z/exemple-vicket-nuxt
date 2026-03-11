import type { Highlighter } from 'shiki'
import { createHighlighter } from 'shiki'

let highlighter: Highlighter | null = null

/**
 * Server-side code highlighting utility (SRP).
 * Keeps heavy Shiki library off the client bundle.
 */
export const highlightCodeServer = async (content: string) => {
  if (!content || !content.includes('```')) return content

  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'vue', 'bash', 'json', 'css', 'html', 'python', 'markdown']
    })
  }

  // Add IDs to headings for TOC
  const headingRegex = /<h([23])>(.*?)<\/h\1>/gi
  let newContent = content.replace(headingRegex, (match, level, text) => {
    const id = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^\w]+/g, '-')
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  // Highlight code blocks
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g
  const matches = [...newContent.matchAll(codeRegex)]

  for (const match of matches) {
    const lang = match[1] || 'text'
    const code = match[2]
    try {
      const highlighted = highlighter.codeToHtml(code, {
        lang,
        theme: 'github-dark' // Default to dark for the demo, or handle based on context
      })
      newContent = newContent.replace(match[0], highlighted)
    } catch (e) {
      console.error(`[Shiki Server] Error highlighting ${lang}:`, e)
    }
  }

  return newContent
}
