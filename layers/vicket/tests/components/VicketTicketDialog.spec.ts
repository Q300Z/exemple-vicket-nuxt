import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketTicketDialog from '../../app/components/VicketTicketDialog.vue'

describe('VicketTicketDialog', () => {
  const mockTemplates = [
    { id: '1', label: 'Tech Support', fields: [] }
  ]

  it('mounts without crashing', async () => {
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { open: true, templates: mockTemplates }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders categories when open', async () => {
    const wrapper = await mountSuspended(VicketTicketDialog, {
      props: { open: true, templates: mockTemplates }
    })
    // Check if the title is visible
    expect(wrapper.text()).toContain('Besoin d\'aide ?')
    expect(wrapper.text()).toContain('Tech Support')
  })
})
