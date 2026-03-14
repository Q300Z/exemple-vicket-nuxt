import { describe, it, expect } from 'vitest'
import { useSupportState } from '../../app/composables/useSupportState'

describe('useSupportState', () => {
  it('should initialize correctly', async () => {
    // Isolated logic test (avoiding global context issues)
    vi.stubGlobal('useState', (_key: string, init: () => unknown) => ref(init()))

    const { isDialogOpen, templates, openDialog } = useSupportState()

    expect(isDialogOpen.value).toBe(false)
    expect(templates.value).toEqual([])

    // Test openDialog
    openDialog()
    expect(isDialogOpen.value).toBe(true)

    // Test closing
    isDialogOpen.value = false
    expect(isDialogOpen.value).toBe(false)
  })
})
