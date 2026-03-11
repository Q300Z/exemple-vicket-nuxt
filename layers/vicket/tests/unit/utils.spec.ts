import { describe, it, expect } from 'vitest'
import { stripHtml, sanitizeHtml, formatDate, formatAnswerText } from '../../app/composables/useVicket'

describe('Vicket Utils', () => {
  it('stripHtml should remove tags', () => {
    expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
  })

  it('sanitizeHtml should remove scripts', () => {
    const dirty = 'Hello <script>alert(1)</script><img src=x onerror=alert(1)>'
    const clean = sanitizeHtml(dirty)
    expect(clean).not.toContain('<script>')
    expect(clean).not.toContain('onerror')
  })

  it('formatDate should format ISO string', () => {
    const iso = '2024-01-01T12:00:00Z'
    const formatted = formatDate(iso)
    expect(formatted).toBeTruthy()
    expect(typeof formatted).toBe('string')
  })

  it('formatAnswerText should handle arrays', () => {
    expect(formatAnswerText('[Item1 Item2]')).toBe('Item1, Item2')
    expect(formatAnswerText('Normal text')).toBe('Normal text')
  })
})
