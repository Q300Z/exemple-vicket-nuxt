import type { IKnowledgeRepository, ITicketRepository, IEngagementRepository, SupportFaq } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'

interface SupportInitData {
  website: { name: string }
  templates: TicketTemplate[]
}

/**
 * Concrete implementations of specialized repositories (SOLID).
 * Optimized for Nuxt 4 with separation between useFetch (SSR) and $fetch (Runtime).
 */
export const useSupportData = () => {
  const websiteName = useState('vicket-website-name', () => 'Support')

  // --- Knowledge Repository Implementation ---
  const knowledge: IKnowledgeRepository = {
    categories: computed(() => {
      // In a real world, this would come from an init API call
      // For this POC, we derive it from what's currently available or stay empty if no tags
      return ['Tous'] // Default to 'Tous', others will be added if Vicket API supports it
    }),

    fetchArticles: (query = '', category = 'Tous') => {
      // useFetch is fine here as it's called in page setup
      return useFetch('/api/vicket/articles', {
        params: { q: query, category },
        key: `articles-${query}-${category}`,
        watch: false
      })
    },

    // NEW: Standalone $fetch for runtime actions (Launcher, Search refresh)
    searchArticles: (query = '', category = 'Tous') => {
      return $fetch<{ success: boolean, data: ArticleSummary[] }>('/api/vicket/articles', {
        params: { q: query, category }
      })
    },

    fetchArticle: (slug: string) => {
      // 1. Persistent Offline Cache (SRP)
      const offlineCache = useLocalStorage<Record<string, { success: boolean, data: ArticleFull }>>('vicket-offline-articles', {})
      
      const fetchResult = useFetch<{ success: boolean, data: ArticleFull }>(`/api/vicket/articles/${slug}`, {
        key: `article-${slug}`
      })

      // 2. Hydrate cache on success
      watchEffect(() => {
        if (fetchResult.data.value?.success) {
          offlineCache.value[slug] = fetchResult.data.value
          console.log(`[Vicket Offline] Cached article: ${slug}`)
        }
      })

      // 3. Fallback to cache if network fails (LSP)
      if (import.meta.client) {
        watchEffect(() => {
          if (fetchResult.status.value === 'error' && offlineCache.value[slug]) {
            console.warn(`[Vicket Offline] Network error, serving from cache: ${slug}`)
            fetchResult.data.value = offlineCache.value[slug]
            fetchResult.status.value = 'success'
          }
        })
      }

      return fetchResult
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
