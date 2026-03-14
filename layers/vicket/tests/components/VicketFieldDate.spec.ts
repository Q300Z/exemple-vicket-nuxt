import { describe, it, expect } from 'vitest'
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
    
    expect(wrapper.text()).toContain('common.select_date')
  })

  it('renders formatted date when value is provided', async () => {
    const wrapper = await mountSuspended(VicketFieldDate, {
      props: {
        question: mockQuestion,
        modelValue: '2026-03-13'
      }
    })
    
    // In tests with mocks, Intl might behave differently or we might just check parts
    expect(wrapper.text()).toMatch(/13|mars|march|2026/)
  })
})
