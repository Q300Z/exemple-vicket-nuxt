<script setup lang="ts">
import { SUPPORT_REPOSITORY_KEY } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'
import type { INavigable } from '../types/ui'

/**
 * Component responsible for displaying related articles (SRP/ISP).
 * Maps domain data (ArticleSummary) to UI interface (INavigable).
 */
interface Props {
  currentArticleId: string
}

const props = defineProps<Props>()
const support = inject(SUPPORT_REPOSITORY_KEY)

const { data: relatedArticles } = support
  ? await support.fetchRelatedArticles(props.currentArticleId)
  : { data: ref([]) }

/**
 * ISP: Converting ArticleSummary to INavigable.
 * The template below only depends on the INavigable interface attributes.
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
    <div class="flex items-center gap-2 text-primary">
      <UIcon
        name="i-lucide-sparkles"
        class="w-4 h-4"
      />
      <span class="text-xs font-extrabold uppercase tracking-widest text-gray-500">Articles suggérés</span>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all group"
      >
        <p class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
          {{ item.label }}
        </p>
        <div class="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <span>Lire la suite</span>
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
