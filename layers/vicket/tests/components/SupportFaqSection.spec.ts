import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SupportFaqSection from '../../../../app/components/support/SupportFaqSection.vue'

const mockFaqs = [
  { id: 'f1', title: 'Question 1', content: 'Réponse 1' },
  { id: 'f2', title: 'Question 2', content: 'Réponse 2' }
]

describe('SupportFaqSection', () => {
  it('mounts correctly', async () => {
    const wrapper = await mountSuspended(SupportFaqSection, {
      props: {
        faqs: mockFaqs
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('handles empty faq list', async () => {
    const wrapper = await mountSuspended(SupportFaqSection, {
      props: {
        faqs: []
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })
})
