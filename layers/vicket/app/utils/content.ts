/**
 * Content processing utilities (SRP).
 */

/**
 * Calculates estimated reading time for a given HTML or text content.
 * Average reading speed: 200 words per minute.
 */
export const calculateReadingTime = (content: string): number => {
  if (!content) return 0
  
  // Strip HTML tags to get pure text
  const text = content.replace(/<[^>]*>/g, '')
  
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  
  return minutes > 0 ? minutes : 1
}
