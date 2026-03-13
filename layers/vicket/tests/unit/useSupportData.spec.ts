import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useSupportData } from '../../app/composables/useSupportData'

// Mock specifically what we need without breaking #app
mockNuxtImport('useFetch', () => {
  return vi.fn(() => ({
    data: ref(null),
    status: ref('idle'),
    refresh: vi.fn()
  }))
})

describe('useSupportData', () => {
  it('initializes repositories correctly', () => {
    const { knowledge, tickets, engagement } = useSupportData()
    expect(knowledge).toBeDefined()
    expect(tickets).toBeDefined()
    expect(engagement).toBeDefined()
  })

  it('provides categories including "Tous"', () => {
    const { knowledge } = useSupportData()
    expect(knowledge.categories.value).toContain('Tous')
  })
})
