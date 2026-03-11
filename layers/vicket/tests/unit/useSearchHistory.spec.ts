import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearchHistory } from '../../app/composables/useSearchHistory'

describe('useSearchHistory', () => {
  const mockCookie = ref<string[]>([])

  beforeEach(() => {
    vi.stubGlobal('useCookie', () => mockCookie)
    mockCookie.value = []
  })

  it('should add items to history and prevent duplicates', () => {
    const { history, addToHistory } = useSearchHistory(3)
    
    addToHistory('test')
    addToHistory('test')
    addToHistory('new')
    
    expect(history.value).toHaveLength(2)
    expect(history.value).toEqual(['new', 'test'])
  })

  it('should respect maxItems limit', () => {
    const { history, addToHistory } = useSearchHistory(2)
    
    addToHistory('1')
    addToHistory('2')
    addToHistory('3')
    
    expect(history.value).toHaveLength(2)
    expect(history.value[0]).toBe('3')
  })
})
