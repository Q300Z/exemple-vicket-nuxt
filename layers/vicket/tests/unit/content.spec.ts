import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '../../app/utils/content'

describe('calculateReadingTime', () => {
  it('returns 0 for empty content', () => {
    expect(calculateReadingTime('')).toBe(0)
  })

  it('calculates 1 minute for short content', () => {
    expect(calculateReadingTime('Hello world')).toBe(1)
  })

  it('strips HTML tags and calculates based on word count', () => {
    // 400 words should be around 2 minutes (at 200 wpm)
    const longText = '<p>' + 'word '.repeat(400) + '</p>'
    expect(calculateReadingTime(longText)).toBe(2)
  })

  it('handles content with only HTML tags', () => {
    // Current implementation returns 1 minute as fallback for any non-empty input
    expect(calculateReadingTime('<div><span></span></div>')).toBe(1)
  })
})
