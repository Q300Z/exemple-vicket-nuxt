import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFieldFactory from '../../app/components/VicketFieldFactory.vue'
import VicketFieldText from '../../app/components/fields/VicketFieldText.vue'
import VicketFieldSelect from '../../app/components/fields/VicketFieldSelect.vue'

describe('VicketFieldFactory', () => {
  const mockQuestion = {
    id: 'q1',
    type: 'TEXT',
    label: 'Test Label',
    required: true
  }

  it('renders a text field by default or for type TEXT', async () => {
    const wrapper = await mountSuspended(VicketFieldFactory, {
      props: {
        modelValue: '',
        question: mockQuestion
      }
    })
    
    expect(wrapper.findComponent(VicketFieldText).exists()).toBe(true)
  })

  it('renders a select field for type SELECT', async () => {
    const wrapper = await mountSuspended(VicketFieldFactory, {
      props: {
        modelValue: '',
        question: { ...mockQuestion, type: 'SELECT', options: [] }
      }
    })
    
    expect(wrapper.findComponent(VicketFieldSelect).exists()).toBe(true)
  })

  it('falls back to text field for unknown types', async () => {
    const wrapper = await mountSuspended(VicketFieldFactory, {
      props: {
        modelValue: '',
        question: { ...mockQuestion, type: 'UNKNOWN' }
      }
    })
    
    expect(wrapper.findComponent(VicketFieldText).exists()).toBe(true)
  })
})
