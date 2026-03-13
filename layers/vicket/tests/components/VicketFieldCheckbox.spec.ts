import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFieldCheckbox from '../../app/components/fields/VicketFieldCheckbox.vue'

describe('VicketFieldCheckbox', () => {
  const mockQuestion = {
    id: 'q1',
    label: 'Options',
    options: [
      { id: 'o1', label: 'Option 1' }, // Note: we use 'id' here to test the fallback logic
      { id: 'o2', label: 'Option 2' }
    ]
  }

  it('renders all options by iterating through them', async () => {
    const wrapper = await mountSuspended(VicketFieldCheckbox, {
      props: {
        question: mockQuestion,
        modelValue: []
      },
      global: {
        stubs: {
          // Robust stub that mimics real rendering logic
          UCheckboxGroup: {
            props: ['items'],
            template: `
              <div data-testid="checkbox-group">
                <div v-for="item in items" :key="item.value">
                  <span class="label">{{ item.label }}</span>
                  <span class="value">{{ item.value }}</span>
                </div>
              </div>
            `
          }
        }
      }
    })
    
    const html = wrapper.html()
    
    // Check labels
    expect(html).toContain('Option 1')
    expect(html).toContain('Option 2')
    
    // Check values (validates our fallback to .id)
    expect(html).toContain('o1')
    expect(html).toContain('o2')
  })
})
