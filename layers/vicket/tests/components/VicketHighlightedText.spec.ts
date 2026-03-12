import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketHighlightedText from '../../app/components/VicketHighlightedText.vue'

describe('VicketHighlightedText', () => {
  it('should render normal text when no query matches', async () => {
    const wrapper = await mountSuspended(VicketHighlightedText, {
      props: { text: 'Hello world', query: 'test' }
    })
    expect(wrapper.text()).toBe('Hello world')
    expect(wrapper.find('mark').exists()).toBe(false)
  })

  it('should wrap matching query in a mark tag', async () => {
    const wrapper = await mountSuspended(VicketHighlightedText, {
      props: { text: 'This is a test', query: 'test' }
    })
    const mark = wrapper.find('mark')
    expect(mark.exists()).toBe(true)
    expect(mark.text()).toBe('test')
    // We check for the transition class instead of the specific dynamic background
    expect(mark.classes()).toContain('transition-colors')
  })

  it('should handle multiple matches', async () => {
    const wrapper = await mountSuspended(VicketHighlightedText, {
      props: { text: 'test and test', query: 'test' }
    })
    expect(wrapper.findAll('mark')).toHaveLength(2)
  })
})
