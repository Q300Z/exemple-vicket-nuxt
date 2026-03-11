<script setup lang="ts">
import type { ArticleSummary } from '~/layers/vicket/app/composables/useVicket'
import { SUPPORT_REPOSITORY_KEY } from '../../../layers/vicket/app/types/repository'

/**
 * Support Index page (Scalable Repository strategy).
 * Injected Repository (DIP).
 */
const support = inject(SUPPORT_REPOSITORY_KEY)
if (!support) throw new Error('Support Repository not provided')

const { fetchInit, categories, fetchArticles } = support
const { stripHtml } = useContent()
const { openDialog, templates } = useSupportState()

const searchQuery = ref('')
const selectedCategory = ref('Tous')

// --- DATA FETCHING ---
onMounted(() => fetchInit())

const { data: articlesData, status: articlesStatus, refresh: refreshArticles } = await fetchArticles(searchQuery.value, selectedCategory.value)

const { data: faqsData, status: faqsStatus, refresh: refreshFaqs } = await useAsyncData(
  'support-faqs',
  () => $fetch('/api/vicket/faqs'),
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
)

/* ── Computed ── */
const articles = computed(() => (articlesData.value?.data || []) as ArticleSummary[])
const faqs = computed(() => faqsData.value?.data || [])
const isLoading = computed(() => articlesStatus.value === 'pending' || faqsStatus.value === 'pending')

const faqItems = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  const list = faqs.value || []
  if (!q) return list.map(f => ({ label: f.question, content: f.answer }))

  return list
    .filter(f => f.question?.toLowerCase().includes(q) || f.answer?.toLowerCase().includes(q))
    .map(f => ({ label: f.question, content: f.answer }))
})

const hasContent = computed(() => (articles.value?.length || 0) > 0 || (faqs.value?.length || 0) > 0)

/* ── Methods ── */
const onSearch = () => {
  refreshArticles()
}

const retryAll = (recover: () => Promise<void>) => {
  refreshArticles()
  refreshFaqs()
  recover()
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Decorative background elements (UX: Depth) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-linear-to-b from-primary-500/5 to-transparent -z-10 pointer-events-none blur-3xl" />

    <UContainer class="py-12 sm:py-20">
      <VicketBreadcrumbs />

      <!-- ── Hero Section ── -->
      <div class="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Comment pouvons-nous vous <span class="primary-gradient-text italic">aider ?</span>
        </h1>
        <p class="text-gray-500 dark:text-gray-500 max-w-2xl mx-auto text-lg sm:text-xl">
          Consultez notre base de connaissances ou contactez notre équipe de support pour une assistance personnalisée.
        </p>

        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <UButton
            v-if="templates?.length > 0"
            icon="i-lucide-message-circle"
            size="xl"
            variant="solid"
            class="rounded-full shadow-xl shadow-primary-500/20 px-10 transition-transform hover:scale-105 active:scale-95"
            @click="openDialog"
          >
            Ouvrir un ticket
          </UButton>
          <UButton
            to="#faq"
            label="Voir la FAQ"
            variant="ghost"
            color="neutral"
            size="xl"
            class="rounded-full"
          />
        </div>
      </div>

      <!-- ── Search & Filters ── -->
      <div class="max-w-4xl mx-auto space-y-8 mb-20 sticky top-[var(--ui-header-height)] z-20 pt-4">
        <div class="glass-effect p-2 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-white/10 ring-1 ring-black/5">
          <VicketSearch
            v-model="searchQuery"
            placeholder="Rechercher une solution, un guide..."
            size="xl"
            @search="onSearch"
          />
        </div>

        <!-- Category Filter -->
        <div
          v-if="categories?.length > 1"
          class="flex flex-wrap justify-center gap-2 animate-in fade-in duration-700"
        >
          <UButton
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            size="md"
            :variant="selectedCategory === cat ? 'solid' : 'subtle'"
            :color="selectedCategory === cat ? 'primary' : 'neutral'"
            class="rounded-full px-6 transition-all"
            @click="selectedCategory = cat"
          />
        </div>
      </div>

      <!-- ── Main Content Area ── -->
      <NuxtErrorBoundary>
        <!-- Loading -->
        <div
          v-if="isLoading && !hasContent"
          class="space-y-12"
        >
          <VicketSupportSkeleton :count="6" />
        </div>

        <!-- Results -->
        <div
          v-else-if="hasContent"
          class="space-y-24"
        >
          <!-- Articles Section -->
          <section
            v-if="articles?.length > 0"
            class="space-y-8"
          >
            <div class="flex items-end justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary shadow-sm">
                  <UIcon
                    name="i-lucide-book-open"
                    class="w-6 h-6"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Articles Populaires
                  </h2>
                  <p class="text-sm text-gray-500">
                    Guides et tutoriels étape par étape.
                  </p>
                </div>
              </div>
              <p class="hidden sm:block text-xs font-bold text-gray-500 uppercase tracking-widest">
                {{ articles.length }} articles
              </p>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              :class="{ 'opacity-50 transition-opacity': isLoading }"
            >
              <NuxtLink
                v-for="article in articles"
                :key="article.id"
                :to="`/support/${article.slug}`"
                class="group flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-1"
              >
                <div class="flex justify-between items-start mb-4">
                  <UBadge
                    v-if="article.category"
                    size="xs"
                    variant="soft"
                    class="rounded-lg px-2.5 py-1"
                  >{{ article.category }}</UBadge>
                  <div class="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 group-hover:text-primary transition-colors">
                    <UIcon
                      name="i-lucide-arrow-right"
                      class="w-4 h-4 transform group-hover:translate-x-1"
                    />
                  </div>
                </div>

                <div
                  class="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors"
                  :style="{ viewTransitionName: `article-title-${article.slug}` }"
                >
                  <VicketHighlightedText
                    :text="article.title"
                    :query="searchQuery"
                  />
                </div>

                <div class="text-sm text-gray-500 dark:text-gray-500 line-clamp-3 leading-relaxed">
                  <VicketHighlightedText
                    :text="stripHtml(article.content)"
                    :query="searchQuery"
                  />
                </div>
              </NuxtLink>
            </div>
          </section>

          <!-- FAQ Section -->
          <section
            v-if="faqItems?.length > 0"
            id="faq"
            class="max-w-4xl mx-auto space-y-8"
          >
            <div class="text-center space-y-2">
              <div class="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 mb-2">
                <UIcon
                  name="i-lucide-help-circle"
                  class="w-8 h-8"
                />
              </div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
                Foire Aux Questions
              </h2>
              <p class="text-gray-500">
                Réponses rapides aux questions les plus fréquentes.
              </p>
            </div>

            <UAccordion
              :items="faqItems"
              variant="ghost"
              class="border rounded-3xl divide-y overflow-hidden luminous-border bg-white/50 dark:bg-gray-900/50 shadow-sm"
              :ui="{
                item: 'transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
                trigger: 'p-6 font-bold text-gray-900 dark:text-white text-base',
                content: 'px-6 pb-6 text-gray-600 dark:text-gray-500 leading-relaxed'
              }"
            >
              <template #item="{ item }">
                <VicketHighlightedText
                  :text="item.content"
                  :query="searchQuery"
                />
              </template>
            </UAccordion>
          </section>
        </div>

        <!-- No Results -->
        <div
          v-else
          class="py-12"
        >
          <VicketEmptyState
            v-if="searchQuery.trim()"
            title="Aucun résultat trouvé"
            :description="`Nous n'avons trouvé aucun article correspondant à « ${searchQuery} ».`"
            icon="i-lucide-search-x"
          >
            <template #actions>
              <UButton
                color="neutral"
                variant="subtle"
                class="rounded-full px-8"
                @click="searchQuery = ''"
              >
                Réinitialiser la recherche
              </UButton>
            </template>
          </VicketEmptyState>

          <VicketEmptyState
            v-else
            title="Besoin d'aide ?"
            description="Notre base de connaissances est en cours de mise à jour. Notre équipe est disponible pour vous répondre directement."
            icon="i-lucide-message-square"
          >
            <template #actions>
              <UButton
                variant="solid"
                size="lg"
                class="rounded-full px-10 shadow-lg shadow-primary-500/20"
                @click="openDialog"
              >
                Contacter le support
              </UButton>
            </template>
          </VicketEmptyState>
        </div>

        <template #error="{ error, recover }">
          <VicketErrorFallback
            :error="error"
            @retry="retryAll(recover)"
          />
        </template>
      </NuxtErrorBoundary>
    </UContainer>
  </div>
</template>
