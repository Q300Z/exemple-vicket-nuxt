import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketBreadcrumbs from '../../app/components/VicketBreadcrumbs.vue'

const mockLinks = [
  { label: 'Support', to: '/support' },
  { label: 'Article', to: '/support/article' }
]

describe('VicketBreadcrumbs', () => {
  it('mounts correctly', async () => {
    const wrapper = await mountSuspended(VicketBreadcrumbs, {
      props: {
        links: mockLinks
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
