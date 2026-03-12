import { defineSitemapEventHandler } from '#imports'

/**
 * Dynamic Sitemap Source (SRP).
 * Fetches all article slugs to provide URLs to the sitemap module.
 */
export default defineSitemapEventHandler(async () => {
  try {
    // Fetch articles from our internal logic (Nitro proxy or mock)
    // Here we use $fetch to call our own index route
    const response = await $fetch<{ data: { slug: string }[] }>('/api/vicket/articles')
    const articles = response.data || []

    return articles.map(a => ({
      loc: `/support/${a.slug}`,
      changefreq: 'weekly',
      priority: 0.8
    }))
  } catch (e) {
    console.error('[Sitemap] Error fetching articles:', e)
    return []
  }
})
