import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ArticlePage from '../../pages/support/[slug].vue'

const mockKnowledge = {
  fetchArticle: vi.fn().mockReturnValue({
    data: ref({ data: { id: '1', title: 'Test', content: 'C', slug: 't' } }),
    status: ref('success')
  }),
  fetchRelatedArticles: vi.fn().mockReturnValue({
    data: ref([]),
    status: ref('success')
  })
}

describe('Article Page', () => {
  it('mounts without crashing', async () => {
    const wrapper = await mountSuspended(ArticlePage, {
      route: '/support/test',
      global: {
        provide: {
          'KNOWLEDGE_REPOSITORY': mockKnowledge,
          'TICKET_REPOSITORY': { fetchTemplates: vi.fn().mockResolvedValue([]) },
          'ENGAGEMENT_REPOSITORY': { submitFeedback: vi.fn() },
          'NOTIFICATION_SERVICE': { success: vi.fn(), error: vi.fn() }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
