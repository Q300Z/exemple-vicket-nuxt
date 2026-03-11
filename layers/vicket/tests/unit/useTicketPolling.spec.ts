import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTicketPolling } from '../../app/composables/useTicketPolling'

describe('useTicketPolling', () => {
  const mockFetchThread = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('fetchTicketThread', mockFetchThread)
    // Ensure ref and useState work in unit test
    vi.stubGlobal('ref', (val: any) => ({ value: val }))
    vi.stubGlobal('useState', (_key: string, init: () => any) => ({ value: init() }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should start polling and call update callback', async () => {
    const token = { value: 'test-token' } as any
    const onUpdate = vi.fn()
    const mockData = { status: { label: 'Open' }, messages: [] }
    mockFetchThread.mockResolvedValue(mockData)

    const { startPolling, isPolling } = useTicketPolling(token, onUpdate, 1000)
    
    startPolling()
    expect(isPolling.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1000)
    
    expect(mockFetchThread).toHaveBeenCalledWith('test-token')
    expect(onUpdate).toHaveBeenCalledWith(mockData)
  })
})
