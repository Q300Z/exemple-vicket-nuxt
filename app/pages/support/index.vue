<script setup lang="ts">
import { KNOWLEDGE_REPOSITORY_KEY } from '#vicket/types/repository'

/**
 * Support Index page (Scalable Repository strategy).
 * Orchestrator Page (Clean Code).
 */
const knowledge = inject(KNOWLEDGE_REPOSITORY_KEY)
if (!knowledge) throw new Error('Knowledge Repository not provided')

useHead({
  title: 'Centre d\'aide'
})

const { fetchArticles, fetchFaqs } = knowledge
const { openDialog, templates } = useSupportState()

const searchQuery = ref('')
const selectedCategory = ref('Tous')

// --- DATA FETCHING ---
const { data: articlesData, status: articlesStatus, refresh: refreshArticles } = await fetchArticles(searchQuery.value, selectedCategory.value)
const { data: faqsData, status: faqsStatus, refresh: refreshFaqs } = await fetchFaqs(searchQuery.value)

/* ── Computed ── */
const articles = computed(() => {
  const allResults = (articlesData.value?.data || [])
  return allResults.filter((item: { type?: string }) => item.type !== 'faq')
})

const hasResults = computed(() => articles.value.length > 0)
const faqs = computed(() => faqsData.value?.data || [])
const isLoading = computed(() => articlesStatus.value === 'pending' || faqsStatus.value === 'pending')

const faqItems = computed(() => faqs.value.map(f => ({ label: f.question, content: f.answer })))
const hasContent = computed(() => articles.value.length > 0 || faqs.value.length > 0)

// Quick Links for proactive support (SRP)
const trendingArticles = computed(() => articles.value.slice(0, 3))

// Dynamic categories derivation (OCP)
const dynamicCategories = computed(() => {
  const cats = new Set(['Tous'])
  articles.value.forEach(a => {
    if (a.category) cats.add(a.category)
  })
  return Array.from(cats)
})

/* ── Methods ── */
const onSearch = () => {
  refreshArticles()
  refreshFaqs()
}

const retryAll = (recover: () => Promise<void>) => {
  onSearch()
  recover()
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden transition-colors duration-500">
    <!-- Decorative background -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] -z-10 pointer-events-none blur-3xl opacity-20"
      :style="{ background: 'linear-gradient(to bottom, var(--ui-primary), transparent)' }"
    />

    <UContainer class="py-12 sm:py-20">
      <VicketBreadcrumbs />

      <SupportHero :templates="templates" @open-ticket="openDialog" />

      <SupportSearchSection
        v-model="searchQuery"
        v-model:category="selectedCategory"
        :categories="dynamicCategories"
        @search="onSearch"
      />

      <!-- ── Main Content Area ── -->
      <NuxtErrorBoundary>
        <div v-if="isLoading && !hasContent" class="space-y-12">
          <VicketSupportSkeleton :count="6" />
        </div>

        <div v-else-if="hasContent" class="space-y-24">
          <SupportArticleSection
            :articles="articles"
            :is-loading="isLoading"
            :search-query="searchQuery"
          />

          <SupportFaqSection
            :faq-items="faqItems"
            :search-query="searchQuery"
          />
        </div>

        <!-- No Results -->
        <div v-else class="py-12">
          <VicketEmptyState
            v-if="searchQuery?.trim()"
            title="Aucun résultat trouvé"
            :description="`Nous n'avons trouvé aucun article correspondant à « ${searchQuery} ».`"
            icon="i-lucide-search-x"
          >
            <template #content>
              <div v-if="trendingArticles.length > 0" class="mt-8 space-y-4">
                <p class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest text-center">Articles populaires</p>
                <div class="flex flex-col gap-2 max-w-sm mx-auto">
                  <UButton
                    v-for="ta in trendingArticles"
                    :key="ta.id"
                    :to="`/support/${ta.slug}`"
                    variant="soft"
                    color="neutral"
                    class="rounded-xl justify-start text-xs font-bold"
                    icon="i-lucide-trending-up"
                    prefetch
                  >
                    {{ ta.title }}
                  </UButton>
                </div>
              </div>
            </template>
            <template #actions>
              <UButton color="neutral" variant="subtle" class="rounded-full px-8" @click="searchQuery = ''; onSearch()">Effacer la recherche</UButton>
            </template>
          </VicketEmptyState>

          <VicketEmptyState
            v-else
            title="Besoin d'aide ?"
            description="Notre base de connaissances est en cours de mise à jour."
            icon="i-lucide-message-square"
          >
            <template #actions>
              <UButton variant="solid" size="lg" class="rounded-full px-10 shadow-lg" @click="openDialog" />
            </template>
          </VicketEmptyState>
        </div>

        <template #error="{ error, recover }">
          <VicketErrorFallback :error="error" @retry="retryAll(recover)" />
        </template>
      </NuxtErrorBoundary>
    </UContainer>
  </div>
</template>
