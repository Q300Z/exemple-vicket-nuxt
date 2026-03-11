import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketSupportLauncher from '../../app/components/VicketSupportLauncher.vue'

describe('VicketSupportLauncher', () => {
  it('should toggle the popover when clicked', async () => {
    // Mock dependencies
    vi.stubGlobal('useSupportState', () => ({
      openDialog: vi.fn()
    }))
    vi.stubGlobal('useSupportData', () => ({
      fetchInit: vi.fn(),
      websiteName: ref('Support')
    }))

    const wrapper = await mountSuspended(VicketSupportLauncher)
    
    // Initially closed
    expect(wrapper.find('.fixed').exists()).toBe(true)
    
    // Find the FAB button (usually the only UButton in root)
    const button = wrapper.find('button')
    await button.trigger('click')
    
    // Check if transition/popover is visible (looking for text in header)
    expect(wrapper.text()).toContain('Support Aide')
  })
})
