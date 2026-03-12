<script setup lang="ts">
import type { ArticleSummary } from '~/layers/vicket/app/composables/useVicket'
import { SUPPORT_REPOSITORY_KEY } from '../../../layers/vicket/app/types/repository'

/**
 * Support Index page (Scalable Repository strategy).
 * Injected Repository (DIP).
 * Layout strictly driven by LayoutManager (OCP).
 */
const support = inject(SUPPORT_REPOSITORY_KEY)
if (!support) throw new Error('Support Repository not provided')

const { fetchInit, categories, fetchArticles } = support
const { stripHtml } = useContent()
const { openDialog, templates } = useSupportState()
const { layout } = useLayoutManager()

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
  <div class="relative min-h-screen overflow-hidden transition-colors duration-500">
    <!-- Decorative background elements -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] -z-10 pointer-events-none blur-3xl opacity-20"
      :style="{ background: 'linear-gradient(to bottom, var(--ui-primary), transparent)' }"
    />

    <UContainer class="py-12 sm:py-20">
      <VicketBreadcrumbs />

      <!-- ── Hero Section ── -->
      <div class="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--ui-text-highlighted)] leading-tight">
          Comment pouvons-nous vous <span class="primary-gradient-text italic">aider ?</span>
        </h1>
        <p class="text-[var(--ui-text-muted)] max-w-2xl mx-auto text-lg sm:text-xl">
          Consultez notre base de connaissances ou contactez notre équipe de support pour une assistance personnalisée.
        </p>

        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <UButton
            v-if="templates?.length > 0"
            icon="i-lucide-message-circle"
            size="xl"
            variant="solid"
            class="rounded-full shadow-xl px-10 transition-transform hover:scale-105 active:scale-95"
            :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
            :ui="{ label: 'text-inverted font-bold' }"
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
        <div class="glass-effect p-2 rounded-3xl shadow-2xl ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]">
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
            class="rounded-full px-6 transition-all shadow-sm"
            :ui="{ label: selectedCategory === cat ? 'font-bold' : '' }"
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
            <div class="flex items-end justify-between border-b border-[var(--ui-border)] pb-4">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] text-[var(--ui-primary)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
                  <UIcon
                    name="i-lucide-book-open"
                    class="w-6 h-6"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
                    Articles Populaires
                  </h2>
                  <p class="text-sm text-[var(--ui-text-muted)]">
                    Guides et tutoriels étape par étape.
                  </p>
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
              <NuxtLink
                v-for="article in articles"
                :key="article.id"
                :to="`/support/${article.slug}`"
                class="group flex p-6 border border-[var(--ui-border)] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] rounded-[var(--ui-radius)] transition-all hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] hover:-translate-y-1"
                :class="[
                  layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-[var(--ui-bg)] flex-col' : 'grid-cols-1',
                  layout === 'minimal' ? 'items-center gap-4 py-4 bg-[var(--ui-bg-accented)] hover:bg-[var(--ui-bg)]' : 'flex-col bg-[var(--ui-bg)]',
                  { 'opacity-50': isLoading }
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
                      variant="soft"
                      class="rounded-lg px-2.5 py-1"
                    >
                      {{ article.category }}
                    </UBadge>
                    <div class="p-2 rounded-xl bg-[var(--ui-bg-accented)] text-[var(--ui-text-muted)] group-hover:text-[var(--ui-primary)] transition-colors">
                      <UIcon
                        name="i-lucide-arrow-right"
                        class="w-4 h-4 transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  <div
                    class="font-bold text-[var(--ui-text-highlighted)] text-lg mb-2 group-hover:text-[var(--ui-primary)] transition-colors"
                    :style="{ viewTransitionName: `article-title-${article.slug}` }"
                  >
                    <VicketHighlightedText
                      :text="article.title"
                      :query="searchQuery"
                    />
                  </div>

                  <div class="text-sm text-[var(--ui-text-muted)] line-clamp-3 leading-relaxed">
                    <VicketHighlightedText
                      :text="stripHtml(article.content)"
                      :query="searchQuery"
                    />
                  </div>
                </template>
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
              <div class="inline-flex p-3 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] text-[var(--ui-primary)] mb-2 shadow-sm">
                <UIcon
                  name="i-lucide-help-circle"
                  class="w-8 h-8"
                />
              </div>
              <h2 class="text-3xl font-bold text-[var(--ui-text-highlighted)]">
                Foire Aux Questions
              </h2>
              <p class="text-[var(--ui-text-muted)]">
                Réponses rapides aux questions les plus fréquentes.
              </p>
            </div>

            <UAccordion
              :items="faqItems"
              variant="ghost"
              class="border rounded-[var(--ui-radius)] divide-y overflow-hidden luminous-border bg-[color-mix(in_srgb,var(--ui-bg)_50%,transparent)] shadow-sm"
              :ui="{
                item: 'transition-all hover:bg-[color-mix(in_srgb,var(--ui-primary)_5%,transparent)]',
                trigger: 'p-6 font-bold text-[var(--ui-text-highlighted)] text-base',
                content: 'px-6 pb-6 text-[var(--ui-text-default)] leading-relaxed'
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
                class="rounded-full px-10 shadow-lg"
                :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
                :ui="{ label: 'font-bold' }"
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
