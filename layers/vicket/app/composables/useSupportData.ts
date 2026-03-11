import type { ISupportRepository } from '../types/repository'

/**
 * Concrete implementation of the Support Repository using Vicket Nitro API.
 * Implements ISupportRepository (DIP).
 */
export const useSupportData = (): ISupportRepository => {
  const websiteName = useState('vicket-website-name', () => 'Support')

  /**
   * Fetches general support info (website name, templates).
   */
  const fetchInit = async () => {
    try {
      const data = await $fetch('/api/vicket/init')
      if (data?.success && data.data) {
        websiteName.value = data.data.website?.name || 'Support'
        return data.data
      }
    } catch (error) {
      console.error('Support Init failed:', error)
    }
    return null
  }

  /**
   * Fetches articles with optional search and category filters.
   */
  const fetchArticles = (query = '', category = 'Tous') => {
    return useFetch('/api/vicket/articles', {
      params: { q: query, category },
      key: `articles-${query}-${category}`,
      watch: false
    })
  }

  /**
   * Fetches a single article by slug.
   */
  const fetchArticle = (slug: string) => {
    return useFetch(`/api/vicket/articles/${slug}`, {
      key: `article-${slug}`
    })
  }

  /**
   * Fetches FAQs.
   */
  const fetchFaqs = () => {
    return useFetch('/api/vicket/faqs', {
      key: 'faqs'
    })
  }

  /**
   * Fetches related articles.
   */
  const fetchRelatedArticles = (currentId: string, limit = 3) => {
    return useFetch('/api/vicket/articles', {
      key: `related-${currentId}`,
      transform: (res: unknown) => {
        const response = res as { success: boolean, data: { id: string }[] }
        if (!response?.success) return []
        return response.data.filter(a => a.id !== currentId).slice(0, limit)
      }
    })
  }

  /**
   * Returns unique categories.
   */
  const categories = computed(() => ['Tous', 'Technique', 'Facturation', 'Général'])

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
