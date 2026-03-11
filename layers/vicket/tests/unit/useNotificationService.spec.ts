import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useNotificationService } from '../../app/composables/useNotificationService'

const mockAdd = vi.fn()
const mockCelebrate = vi.fn()

mockNuxtImport('useToast', () => {
  return () => ({ add: mockAdd })
})

mockNuxtImport('useVisualEffects', () => {
  return () => ({ fireSuccessConfetti: mockCelebrate })
})

describe('useNotificationService', () => {
  beforeEach(() => {
    mockAdd.mockClear()
    mockCelebrate.mockClear()
  })

  it('should trigger success notification', () => {
    const service = useNotificationService()
    service.success('Success')
    expect(mockAdd).toHaveBeenCalled()
  })

  it('should trigger celebration', () => {
    const service = useNotificationService()
    service.celebrate()
    expect(mockCelebrate).toHaveBeenCalled()
  })
})
