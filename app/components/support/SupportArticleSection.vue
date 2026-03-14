<script setup lang="ts">
import type { ArticleSummary } from '#vicket/types/vicket'

/**
 * Article Grid component (SRP).
 * Driven by LayoutManager and filtered data.
 */
interface Props {
  articles: ArticleSummary[]
  isLoading: boolean
  searchQuery: string
}
defineProps<Props>()

const { layout } = useLayoutManager()
const { stripHtml } = useContent()
</script>

<template>
  <section v-if="articles?.length > 0" class="space-y-8">
    <div class="flex items-end justify-between border-b border-[var(--ui-border)] pb-4">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] text-[var(--ui-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
          <UIcon name="i-lucide-book-open" class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">Articles Populaires</h2>
          <p class="text-sm text-[var(--ui-text-muted)]">Guides et tutoriels étape par étape.</p>
        </div>
      </div>
      <p class="hidden sm:block text-xs font-bold text-[var(--ui-text-muted)] uppercase tracking-widest">
        {{ articles.length }} articles
      </p>
    </div>

    <!-- Dynamic Layout Engine -->
    <div
      class="grid gap-6 transition-all duration-500"
      :class="[
        layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1',
        { 'opacity-50': isLoading }
      ]"
    >
      <!-- Wrap in DIV for v-motion to fix Vue Lifecycle warnings on NuxtLink -->
      <div
        v-for="(article, index) in articles"
        :key="article.id"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
      >
        <NuxtLink
          :to="`/support/${article.slug}`"
          prefetch
          class="group flex p-6 border border-[var(--ui-border)] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] rounded-[var(--ui-radius)] transition-all h-full hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] hover:-translate-y-1"
          :class="[
            layout === 'grid' ? 'bg-[var(--ui-bg)] flex-col' : 'grid-cols-1',
            layout === 'minimal' ? 'items-center gap-4 py-4 bg-[var(--ui-bg-accented)] hover:bg-[var(--ui-bg)]' : 'flex-col bg-[var(--ui-bg)]',
          ]"
        >
          <!-- Layout Conditional Render -->
          <template v-if="layout === 'minimal'">
            <div class="p-2 rounded-xl bg-[var(--ui-bg)] text-[var(--ui-primary)] shrink-0 border border-[var(--ui-border)] group-hover:border-[var(--ui-primary)] transition-colors">
              <UIcon name="i-lucide-file-text" class="w-5 h-5" />
            </div>
            <div class="font-bold text-[var(--ui-text-highlighted)] text-base group-hover:text-[var(--ui-primary)] transition-colors grow">
              {{ article.title }}
            </div>
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-[var(--ui-text-muted)] group-hover:translate-x-1 transition-transform" />
          </template>

          <template v-else>
            <div class="flex justify-between items-start mb-4">
              <UBadge 
                v-if="article.category" 
                size="xs" 
                variant="subtle" 
                class="rounded-lg px-2.5 py-1 font-bold text-primary-700 dark:text-primary-300"
              >
                {{ article.category }}
              </UBadge>
              <div 
                class="p-2 rounded-xl bg-[var(--ui-bg-accented)] text-[var(--ui-text-muted)] group-hover:text-[var(--ui-primary)] transition-colors"
                aria-hidden="true"
              >
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transform group-hover:translate-x-1" />
              </div>
            </div>

            <div
              class="font-bold text-[var(--ui-text-highlighted)] text-lg mb-2 group-hover:text-[var(--ui-primary)] transition-colors"
              :style="{ viewTransitionName: `article-title-${article.id}` }"
            >
              <VicketHighlightedText :text="article.title" :query="searchQuery" />
            </div>

            <div class="text-sm text-[var(--ui-text-muted)] line-clamp-3 leading-relaxed">
              <VicketHighlightedText :text="stripHtml(article.content || '')" :query="searchQuery" />
            </div>
          </template>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
