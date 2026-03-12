/**
 * Lightweight Server-side content processor (SRP).
 * Shiki removed for build optimization.
 * Still handles TOC ID generation.
 */
export const highlightCodeServer = async (content: string) => {
  if (!content) return content

  // Add IDs to headings for TOC
  const headingRegex = /<h([23])>(.*?)<\/h\1>/gi
  let newContent = content.replace(headingRegex, (match, level, text) => {
    const id = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^\w]+/g, '-')
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  // Basic fallback for code blocks (since shiki is removed)
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g
  newContent = newContent.replace(codeRegex, (match, lang, code) => {
    return `<pre class="vk-code-block"><code class="language-${lang || 'text'}">${code}</code></pre>`
  })

  return newContent
}
