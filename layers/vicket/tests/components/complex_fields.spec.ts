import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFieldTextarea from '../../app/components/fields/VicketFieldTextarea.vue'
import VicketFieldSelect from '../../app/components/fields/VicketFieldSelect.vue'
import VicketFieldFile from '../../app/components/fields/VicketFieldFile.vue'

describe('Vicket Complex Fields', () => {
  it('VicketFieldTextarea should render', async () => {
    const wrapper = await mountSuspended(VicketFieldTextarea, {
      props: {
        modelValue: 'initial',
        question: { id: 'q1', label: 'Message' }
      }
    })
    
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('VicketFieldSelect should render options', async () => {
    const wrapper = await mountSuspended(VicketFieldSelect, {
      props: {
        modelValue: 'opt1',
        question: { 
          id: 'q1', 
          label: 'Choice',
          options: [{ label: 'Option 1', value: 'opt1' }]
        }
      }
    })
    expect(wrapper.text()).toContain('Option 1')
  })

  it('VicketFieldFile should handle file selection', async () => {
    const wrapper = await mountSuspended(VicketFieldFile, {
      props: {
        modelValue: null,
        question: { id: 'q1', label: 'Upload' }
      }
    })
    expect(wrapper.text()).toContain('vicket.dropzone_title')
  })
})
