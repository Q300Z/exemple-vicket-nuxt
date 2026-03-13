import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketFieldDate from '../../app/components/fields/VicketFieldDate.vue'

describe('VicketFieldDate', () => {
  const mockQuestion = { id: 'q1', label: 'Date selection' }

  it('renders with placeholder when empty', async () => {
    const wrapper = await mountSuspended(VicketFieldDate, {
      props: {
        question: mockQuestion,
        modelValue: ''
      }
    })
    
    expect(wrapper.text()).toContain('Sélectionner une date')
  })

  it('renders formatted date when value is provided', async () => {
    const wrapper = await mountSuspended(VicketFieldDate, {
      props: {
        question: mockQuestion,
        modelValue: '2026-03-13'
      }
    })
    
    // Check if it renders the date in French format (Intl default in my component)
    expect(wrapper.text()).toContain('13 mars 2026')
  })
})
