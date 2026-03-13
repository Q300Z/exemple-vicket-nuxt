import type { Article } from './useVicket'

/**
 * Composable responsible for Support Article SEO (SRP).
 * Automatically injects OpenGraph and JSON-LD for the knowledge base.
 */
export const useVicketSEO = (article: Article | null) => {
  if (!article) return

  const { site } = useAppConfig()
  const siteUrl = site?.url || 'https://demo-vicket.app'
  const articleUrl = `${siteUrl}/support/${article.slug}`

  // 1. Standard and OpenGraph Meta (Nuxt 4 Style)
  useServerSeoMeta({
    title: `${article.title} - Support`,
    ogTitle: article.title,
    description: article.content ? article.content.substring(0, 160).replace(/<[^>]*>/g, '') : '',
    ogDescription: article.content ? article.content.substring(0, 160).replace(/<[^>]*>/g, '') : '',
    ogType: 'article',
    ogUrl: articleUrl,
    twitterCard: 'summary_large_image',
    articlePublishedTime: new Date().toISOString() // Assuming current if not provided
  })

  // 2. Structured Data (JSON-LD) for Schema.org Article
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': article.title,
          'description': article.content ? article.content.substring(0, 160).replace(/<[^>]*>/g, '') : '',
          'url': articleUrl,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': articleUrl
          },
          'publisher': {
            '@type': 'Organization',
            'name': site?.name || 'Vicket Showcase',
            'logo': {
              '@type': 'ImageObject',
              'url': `${siteUrl}/favicon.ico`
            }
          }
        })
      }
    ]
  })
}
