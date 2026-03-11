import { describe, it, expect } from 'vitest'
import { useContent } from '../../app/composables/useContent'

describe('useContent', () => {
  const { sanitize, stripHtml, highlight } = useContent()

  describe('sanitize', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> world'
      expect(sanitize(input)).toBe('Hello  world')
    })

    it('should remove inline event handlers', () => {
      const input = '<div onclick="alert(1)">Click me</div>'
      expect(sanitize(input)).toBe('<div>Click me</div>')
    })
  })

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>'
      expect(stripHtml(input)).toBe('Hello world')
    })
  })

  describe('highlight', () => {
    it('should return a single segment if no query is provided', () => {
      const text = 'Hello world'
      const segments = highlight(text, '')
      expect(segments).toEqual([{ text: 'Hello world', match: false }])
    })

    it('should split text into correct segments for a matching query', () => {
      const text = 'This is a test message'
      const query = 'test'
      const segments = highlight(text, query)

      expect(segments).toEqual([
        { text: 'This is a ', match: false },
        { text: 'test', match: true },
        { text: ' message', match: false }
      ])
    })

    it('should be case insensitive', () => {
      const text = 'HELLO world'
      const query = 'hello'
      const segments = highlight(text, query)

      expect(segments[0].match).toBe(true)
      expect(segments[0].text).toBe('HELLO')
    })
  })
})
