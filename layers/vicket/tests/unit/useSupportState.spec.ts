import { describe, it, expect, vi } from 'vitest'
import { useSupportState } from '../../app/composables/useSupportState'

describe('useSupportState', () => {
  it('should open dialog and load templates', async () => {
    // Direct manual ref mock to bypass useState logic entirely
    vi.stubGlobal('useState', (_key: string, init: () => any) => {
      const val = init()
      return {
        value: val,
        _isRef: true
      }
    })

    const mockFetchInit = vi.fn(() => Promise.resolve({ 
      templates: [{ id: '1', name: 'T1' }] 
    }))
    vi.stubGlobal('fetchSupportInit', mockFetchInit)

    const { isDialogOpen, openDialog, templates, loadTemplates } = useSupportState()
    
    openDialog()
    expect(isDialogOpen.value).toBe(true)
    
    await loadTemplates()
    
    expect(templates.value).toHaveLength(1)
    expect(templates.value[0].name).toBe('T1')
  })
})
