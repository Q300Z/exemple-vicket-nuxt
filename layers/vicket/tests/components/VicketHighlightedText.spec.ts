import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketHighlightedText from '../../app/components/VicketHighlightedText.vue'

describe('VicketHighlightedText', () => {
  it('should render normal text when no query matches', async () => {
    const component = await mountSuspended(VicketHighlightedText, {
      props: {
        text: 'Hello world',
        query: 'test'
      }
    })

    expect(component.text()).toBe('Hello world')
    expect(component.find('mark').exists()).toBe(false)
  })

  it('should wrap matching query in a mark tag', async () => {
    const component = await mountSuspended(VicketHighlightedText, {
      props: {
        text: 'This is a test',
        query: 'test'
      }
    })

    expect(component.text()).toBe('This is a test')
    const mark = component.find('mark')
    expect(mark.exists()).toBe(true)
    expect(mark.text()).toBe('test')
    expect(mark.classes()).toContain('bg-primary-500/30')
  })

  it('should handle multiple matches', async () => {
    const component = await mountSuspended(VicketHighlightedText, {
      props: {
        text: 'Test one, test two',
        query: 'test'
      }
    })

    const marks = component.findAll('mark')
    expect(marks).toHaveLength(2)
    expect(marks[0].text()).toBe('Test')
    expect(marks[1].text()).toBe('test')
  })
})
