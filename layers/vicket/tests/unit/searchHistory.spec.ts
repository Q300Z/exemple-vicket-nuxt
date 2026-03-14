import { describe, it, expect, vi } from 'vitest'
import { useSearchHistory } from '../../app/composables/useSearchHistory'

// Mock Nuxt composables
const mockCookie = ref<string[]>([])
const mockState = ref<string[]>([])
vi.stubGlobal('useCookie', () => mockCookie)
vi.stubGlobal('useState', (key: string, init: () => string[]) => {
  if (mockState.value.length === 0 && init) mockState.value = init()
  return mockState
})

describe('useSearchHistory', () => {
  it('should add a unique query to history', () => {
    const { history, addToHistory } = useSearchHistory(5, [])
    
    addToHistory('nuxt 4')
    expect(history.value).toContain('nuxt 4')
    
    addToHistory('vicket')
    expect(history.value[0]).toBe('vicket') // Most recent first
  })

  it('should deduplicate queries and move them to front', () => {
    const { history, addToHistory } = useSearchHistory(5, [])
    
    addToHistory('alpha')
    addToHistory('beta')
    addToHistory('alpha')
    
    expect(history.value).toHaveLength(2)
    expect(history.value[0]).toBe('alpha')
  })

  it('should limit history size to 5 items', () => {
    const { history, addToHistory } = useSearchHistory(5, [])
    
    addToHistory('1')
    addToHistory('2')
    addToHistory('3')
    addToHistory('4')
    addToHistory('5')
    addToHistory('6')
    
    expect(history.value).toHaveLength(5)
    expect(history.value[0]).toBe('6')
    expect(history.value).not.toContain('1')
  })
})
