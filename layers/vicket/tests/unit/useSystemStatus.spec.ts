import { describe, it, expect, vi } from 'vitest'
import { useSystemStatus } from '../../app/composables/useSystemStatus'

describe('useSystemStatus', () => {
  it('should fetch system status', async () => {
    vi.stubGlobal('useFetch', vi.fn(() => ({
      data: ref({ success: true, status: 'operational' }),
      refresh: vi.fn()
    })))

    const { status } = useSystemStatus()
    expect(status.value).toBe('operational')
  })
})
