import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFieldFactory from '../../app/components/VicketFieldFactory.vue'
import VicketFieldText from '../../app/components/fields/VicketFieldText.vue'
import VicketFieldSelect from '../../app/components/fields/VicketFieldSelect.vue'

describe('VicketFieldFactory', () => {
  it('should render VicketFieldText for TEXT type', async () => {
    const wrapper = await mountSuspended(VicketFieldFactory, {
      props: {
        modelValue: '',
        question: { id: 'q1', type: 'TEXT', label: 'Name' }
      }
    })
    
    expect(wrapper.findComponent(VicketFieldText).exists()).toBe(true)
  })

  it('should render VicketFieldSelect for SELECT type', async () => {
    const wrapper = await mountSuspended(VicketFieldFactory, {
      props: {
        modelValue: '',
        question: { id: 'q2', type: 'SELECT', label: 'Choice', options: [] }
      }
    })
    
    expect(wrapper.findComponent(VicketFieldSelect).exists()).toBe(true)
  })
})
