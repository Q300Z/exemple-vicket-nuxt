import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useVicketInjection } from '../../composables/useVicketInjection'

describe('useVicketInjection', () => {
  it('provides all repositories and services', () => {
    // Mock Nuxt built-ins
    vi.stubGlobal('useState', (_key: string, init: () => unknown) => ref(init()))
    vi.stubGlobal('useFetch', () => ({ data: ref(null), status: ref('idle'), refresh: vi.fn() }))
    vi.stubGlobal('provide', vi.fn())

    const result = useVicketInjection()
    
    expect(result.knowledge).toBeDefined()
    expect(result.tickets).toBeDefined()
    expect(result.engagement).toBeDefined()
    expect(result.notificationService).toBeDefined()
  })
})
