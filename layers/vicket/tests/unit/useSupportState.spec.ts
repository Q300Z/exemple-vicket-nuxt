import { describe, it, expect, vi } from 'vitest'
import { useSupportState } from '../../app/composables/useSupportState'

describe('useSupportState', () => {
  it('should initialize correctly', async () => {
    // Isolated logic test (avoiding global context issues)
    vi.stubGlobal('useState', (_key: string, init: () => unknown) => ref(init()))

    const { isDialogOpen, templates } = useSupportState()

    expect(isDialogOpen.value).toBe(false)
    expect(templates.value).toEqual([])
  })
})
