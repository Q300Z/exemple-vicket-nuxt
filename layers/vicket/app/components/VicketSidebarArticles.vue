<script setup lang="ts">
import { SUPPORT_REPOSITORY_KEY } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'

/**
 * Component responsible for displaying related articles (SRP/ISP).
 */
interface Props {
  currentArticleId: string
}

const props = defineProps<Props>()
const support = inject(SUPPORT_REPOSITORY_KEY)

// More defensive fetch handling (ISP)
const { data: relatedArticles } = support 
  ? await support.fetchRelatedArticles(props.currentArticleId)
  : { data: ref([]) }

const items = computed(() => (relatedArticles?.value || []) as ArticleSummary[])
</script>

<template>
  <div
    v-if="items && items.length > 0"
    class="space-y-4"
  >
    <div class="flex items-center gap-2 text-primary">
      <UIcon
        name="i-lucide-sparkles"
        class="w-4 h-4"
      />
      <span class="text-xs font-extrabold uppercase tracking-widest">Articles suggérés</span>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="article in items"
        :key="article.id"
        :to="`/support/${article.slug}`"
        class="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 transition-all group"
      >
        <p class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
          {{ article.title }}
        </p>
        <div class="flex items-center gap-1 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span>Lire la suite</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
          />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
