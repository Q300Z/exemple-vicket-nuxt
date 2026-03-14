import { describe, it, expect } from 'vitest'
import { useContent } from '../../app/composables/useContent'

describe('Vicket Utils', () => {
  const { stripHtml, sanitize, formatAnswerText } = useContent()

  it('stripHtml should remove tags', () => {
    expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
  })

  it('sanitizeHtml should remove scripts', () => {
    const dirty = 'Hello <script>alert(1)</script><img src=x onerror=alert(1)>'
    const clean = sanitize(dirty)
    expect(clean).not.toContain('<script>')
    expect(clean).not.toContain('onerror')
  })

  it('formatAnswerText should handle arrays', () => {
    expect(formatAnswerText(['Item1', 'Item2'])).toBe('Item1, Item2')
    expect(formatAnswerText('Normal text')).toBe('Normal text')
  })
})
