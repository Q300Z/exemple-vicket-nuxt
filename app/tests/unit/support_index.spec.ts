import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SupportIndex from '../../pages/support/index.vue'

const mockKnowledge = {
  fetchArticles: vi.fn().mockReturnValue({
    data: ref({ data: [] }),
    status: ref('success'),
    refresh: vi.fn()
  }),
  fetchFaqs: vi.fn().mockReturnValue({
    data: ref({ data: [] }),
    status: ref('success'),
    refresh: vi.fn()
  }),
  categories: ref(['Tous', 'Tech'])
}

describe('SupportIndex Page', () => {
  it('mounts without crashing', async () => {
    const wrapper = await mountSuspended(SupportIndex, {
      global: {
        provide: {
          'KNOWLEDGE_REPOSITORY': mockKnowledge,
          'TICKET_REPOSITORY': { websiteName: ref('Support'), fetchTemplates: vi.fn().mockResolvedValue([]) }
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
