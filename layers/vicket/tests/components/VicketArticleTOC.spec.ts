import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketArticleTOC from '../../app/components/VicketArticleTOC.vue'

describe('VicketArticleTOC', () => {
  it('renders correctly with headings', async () => {
    const content = '<h2 id="title-1">Title 1</h2><h3 id="title-2">Title 2</h3>'
    const component = await mountSuspended(VicketArticleTOC, {
      props: { content }
    })

    expect(component.text()).toContain('Sommaire')
    expect(component.text()).toContain('Title 1')
    expect(component.text()).toContain('Title 2')
  })

  it('does not render if no headings', async () => {
    const content = '<p>No headings here</p>'
    const component = await mountSuspended(VicketArticleTOC, {
      props: { content }
    })

    expect(component.find('nav').exists()).toBe(false)
  })
})
