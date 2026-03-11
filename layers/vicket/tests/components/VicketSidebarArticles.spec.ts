import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VicketSidebarArticles from '../../app/components/VicketSidebarArticles.vue'
import { SUPPORT_REPOSITORY_KEY } from '../../app/types/repository'

describe.skip('VicketSidebarArticles', () => {
  it('should render related articles', async () => {
    const mockArticles = [
      { id: '2', title: 'Related 1', slug: 'related-1' }
    ]

    const mockRepo = {
      fetchRelatedArticles: vi.fn(() => ({
        data: ref(mockArticles),
        status: ref('success')
      }))
    }

    const wrapper = await mountSuspended(VicketSidebarArticles, {
      props: { currentArticleId: '1' },
      global: {
        provide: {
          [SUPPORT_REPOSITORY_KEY as symbol]: mockRepo
        }
      }
    })

    // Wait more for async setup inside component
    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.html()).toContain('Related 1')
  })
})
