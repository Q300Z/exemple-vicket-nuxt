<script setup lang="ts">
import { KNOWLEDGE_REPOSITORY_KEY } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'
import type { INavigable } from '../types/ui'

/**
 * Component responsible for displaying related articles (SRP/ISP).
 * Maps domain data (ArticleSummary) to UI interface (INavigable).
 * 100% Nuxt UI v4 compliant with semantic tokens.
 */
interface Props {
  currentArticleId: string
}

const props = defineProps<Props>()
const knowledge = inject(KNOWLEDGE_REPOSITORY_KEY)

const { data: relatedArticles } = knowledge
  ? await knowledge.fetchRelatedArticles(props.currentArticleId)
  : { data: ref([]) }


/**
 * ISP: Converting ArticleSummary to INavigable.
 */
const navItems = computed<INavigable[]>(() => {
  const articles = (relatedArticles?.value || []) as ArticleSummary[]
  return articles.map(a => ({
    label: a.title,
    to: `/support/${a.slug}`,
    icon: 'i-lucide-arrow-right'
  }))
})
</script>

<template>
  <div
    v-if="navItems.length > 0"
    class="space-y-4"
  >
    <div class="flex items-center gap-2 text-[var(--ui-primary)]">
      <UIcon
        name="i-lucide-sparkles"
        class="w-4 h-4"
      />
      <span class="text-[10px] font-extrabold uppercase tracking-widest text-[var(--ui-text-muted)]">{{ $t('support.article.suggested_articles') }}</span>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="block p-4 rounded-[var(--ui-radius)] bg-[var(--ui-bg)] border border-[var(--ui-border)] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] hover:shadow-lg hover:shadow-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] transition-all group"
      >
        <p class="text-sm font-bold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)] transition-colors line-clamp-2">
          {{ item.label }}
        </p>
        <div class="flex items-center gap-1 mt-2 text-[9px] font-bold text-[var(--ui-text-muted)] uppercase tracking-wider">
          <span>{{ $t('support.article.read_more') }}</span>
          <UIcon
            v-if="item.icon"
            :name="item.icon"
            class="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
