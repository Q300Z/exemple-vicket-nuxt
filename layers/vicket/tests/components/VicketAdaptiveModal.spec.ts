import { describe, it, expect } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import VicketAdaptiveModal from '../../app/components/VicketAdaptiveModal.vue'

mockNuxtImport('useDevice', () => {
  return () => ({ isMobile: false })
})

describe('VicketAdaptiveModal', () => {
  it('mounts correctly', async () => {
    const component = await mountSuspended(VicketAdaptiveModal, {
      props: {
        modelValue: true,
        title: 'Test Modal'
      }
    })
    expect(component.exists()).toBe(true)
  })
})
