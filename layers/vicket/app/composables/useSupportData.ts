import type { IKnowledgeRepository, ITicketRepository, IEngagementRepository, SupportFaq } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'

interface SupportInitData {
  website: { name: string }
  templates: TicketTemplate[]
}

/**
 * Concrete implementations of specialized repositories (SOLID).
 */
export const useSupportData = () => {
  const websiteName = useState('vicket-website-name', () => 'Support')

  // --- Knowledge Repository Implementation ---
  const knowledge: IKnowledgeRepository = {
    categories: computed(() => ['Tous', 'Technique', 'Facturation', 'Général']),

    fetchArticles: (query = '', category = 'Tous') => {
      return useFetch('/api/vicket/articles', {
        params: { q: query, category },
        key: `articles-${query}-${category}`,
        watch: false
      })
    },

    fetchArticle: (slug: string) => {
      return useFetch(`/api/vicket/articles/${slug}`, {
        key: `article-${slug}`
      })
    },

    fetchFaqs: (query = '') => {
      return useFetch('/api/vicket/faqs', {
        key: `faqs-${query}`,
        transform: (res: { success: boolean, data: SupportFaq[] }) => {
          if (!query) return res
          const q = query.toLowerCase()
          return {
            ...res,
            data: res.data.filter((f: SupportFaq) => 
              f.question.toLowerCase().includes(q) || 
              f.answer.toLowerCase().includes(q)
            )
          }
        }
      })
    },

    fetchRelatedArticles: (currentId: string, limit = 3) => {
      return useFetch('/api/vicket/articles', {
        key: `related-${currentId}`,
        transform: (res: { success: boolean, data: ArticleSummary[] }) => {
          if (!res?.success) return []
          return res.data.filter((a: ArticleSummary) => a.id !== currentId).slice(0, limit)
        }
      })
    }
  }

  // --- Ticket Repository Implementation ---
  const tickets: ITicketRepository = {
    websiteName,
    fetchInit: async () => {
      try {
        const data = await $fetch<{ success: boolean, data: SupportInitData }>('/api/vicket/init')
        if (data?.success && data.data) {
          websiteName.value = data.data.website?.name || 'Support'
          return data.data
        }
      } catch (e) { console.error(e) }
      return null
    },
    createTicket: (payload) => $fetch('/api/vicket/tickets', { method: 'POST', body: payload }),
    fetchTemplates: async () => {
      const res = await $fetch<{ success: boolean, data: { templates: TicketTemplate[] } }>('/api/vicket/init')
      return res?.data?.templates || []
    }
  }

  // --- Engagement Repository Implementation ---
  const engagement: IEngagementRepository = {
    submitFeedback: (articleId, helpful) => 
      $fetch(`/api/vicket/articles/${articleId}/feedback`, { method: 'POST', body: { helpful } })
  }

  return {
    knowledge,
    tickets,
    engagement
  }
}
