import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFileDropZone from '../../app/components/VicketFileDropZone.vue'

describe('VicketFileDropZone', () => {
  it('renders the drop zone with correct label', async () => {
    const wrapper = await mountSuspended(VicketFileDropZone)
    expect(wrapper.text()).toContain('Cliquer ou glisser vos fichiers')
  })

  it('updates state when dragging files over', async () => {
    const wrapper = await mountSuspended(VicketFileDropZone)
    const zone = wrapper.find('div[role="button"]')
    
    await zone.trigger('dragover')
    // Check if the dragging class is applied (visual state check)
    expect(zone.classes()).toContain('border-primary-500')
    
    await zone.trigger('dragleave')
    expect(zone.classes()).not.toContain('border-primary-500')
  })
})
