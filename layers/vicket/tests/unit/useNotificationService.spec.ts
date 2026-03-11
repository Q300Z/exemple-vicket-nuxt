import { describe, it, expect, vi } from 'vitest'
import { useNotificationService } from '../../app/composables/useNotificationService'

describe('useNotificationService', () => {
  it('should trigger success notification', () => {
    let called = false
    vi.stubGlobal('useToast', () => ({ 
      add: () => { called = true } 
    }))
    
    const service = useNotificationService()
    service.success('Success')
    expect(called).toBe(true)
  })

  it('should trigger celebration', () => {
    let called = false
    vi.stubGlobal('useVisualEffects', () => ({ 
      fireSuccessConfetti: () => { called = true } 
    }))
    
    const service = useNotificationService()
    service.celebrate()
    expect(called).toBe(true)
  })
})
