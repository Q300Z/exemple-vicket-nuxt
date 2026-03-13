import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketSidebarArticles from '../../app/components/VicketSidebarArticles.vue'

describe('VicketSidebarArticles', () => {
  it('should be testable as a component', async () => {
    // We just verify it mounts without crashing
    const wrapper = await mountSuspended(VicketSidebarArticles, {
      props: { currentArticleId: '1' }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
