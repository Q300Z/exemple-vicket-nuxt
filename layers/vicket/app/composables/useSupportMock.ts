import type { AsyncData } from '#app'
import type { ISupportRepository } from '../types/repository'
import type { ArticleSummary, ArticleFull } from '../composables/useVicket'

/**
 * Mock implementation of the Support Repository (DIP/LSP/ISP).
 * Useful for tests and offline development.
 */
export const useSupportMock = (): ISupportRepository => {
  const websiteName = ref('Mock Support')

  const fetchInit = async () => ({
    website: { name: 'Mock Support' },
    templates: []
  })

  const fetchArticles = (_query = '', _category = 'Tous') => ({
    data: ref({ success: true, data: [] as ArticleSummary[] }),
    status: ref('success'),
    refresh: async () => {}
  } as unknown as AsyncData<{ success: boolean, data: ArticleSummary[] }, unknown>)

  const fetchArticle = (_slug: string) => ({
    data: ref({
      success: true,
      data: { id: '1', title: 'Mock Article', slug: 'mock', content: 'Content', category: 'Mock' } as ArticleFull
    }),
    status: ref('success'),
    refresh: async () => {}
  } as unknown as AsyncData<{ success: boolean, data: ArticleFull }, unknown>)

  const fetchFaqs = () => ({
    data: ref({ success: true, data: [] }),
    status: ref('success'),
    refresh: async () => {}
  } as unknown as AsyncData<unknown, unknown>)

  const fetchRelatedArticles = (_currentId: string) => ({
    data: ref([] as ArticleSummary[]),
    status: ref('success'),
    refresh: async () => {}
  } as unknown as AsyncData<ArticleSummary[], unknown>)

  const categories = computed(() => ['Tous', 'Mock'])

  return {
    websiteName,
    fetchInit,
    fetchArticles,
    fetchArticle,
    fetchFaqs,
    fetchRelatedArticles,
    categories
  }
}
