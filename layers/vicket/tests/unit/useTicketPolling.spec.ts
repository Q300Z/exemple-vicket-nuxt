import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useTicketPolling } from '../../app/composables/useTicketPolling'

// Official mock for composables
mockNuxtImport('useIntervalFn', () => {
  return vi.fn(() => ({
    paused: ref(true)
  }))
})

describe('useTicketPolling', () => {
  it('should initialize correctly', () => {
    const token = ref('test-token')
    const { isPolling } = useTicketPolling(token, vi.fn())
    expect(isPolling.value).toBe(false)
  })
})
