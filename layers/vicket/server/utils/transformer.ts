import type { Article } from '~/app/composables/useVicket'

/**
 * Server-side utility responsible for enriching Vicket data (SRP).
 */
export const VicketServerTransformer = {
  /**
   * Applies code highlighting to all articles in a list.
   */
  async enrichArticles(articles: Article[]) {
    if (!articles) return []

    // Process in parallel for speed
    await Promise.all(articles.map(async (article) => {
      if (article.content) {
        article.content = await highlightCodeServer(article.content)
      }
    }))

    return articles
  },

  /**
   * Enriches a single article.
   */
  async enrichArticle(article: Article) {
    if (article?.content) {
      article.content = await highlightCodeServer(article.content)
    }
    return article
  }
}
