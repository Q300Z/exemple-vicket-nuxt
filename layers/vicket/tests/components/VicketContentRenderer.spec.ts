import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketContentRenderer from '../../app/components/VicketContentRenderer.vue'

describe('VicketContentRenderer', () => {
  it('should render the provided HTML content', async () => {
    const content = '<p>Simple paragraph</p>'
    const component = await mountSuspended(VicketContentRenderer, {
      props: { content }
    })

    expect(component.html()).toContain('<p>Simple paragraph</p>')
  })

  it('should render headings with IDs', async () => {
    const content = '<h2 id="test-title">Test Title</h2>'
    const component = await mountSuspended(VicketContentRenderer, {
      props: { content }
    })

    const h2 = component.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.attributes('id')).toBe('test-title')
    expect(h2.text()).toBe('Test Title')
  })

  it('should render blockquotes with custom styles', async () => {
    const content = '<blockquote>Quote text</blockquote>'
    const component = await mountSuspended(VicketContentRenderer, {
      props: { content }
    })

    expect(component.find('blockquote').exists()).toBe(true)
    expect(component.text()).toContain('Quote text')
  })
})
