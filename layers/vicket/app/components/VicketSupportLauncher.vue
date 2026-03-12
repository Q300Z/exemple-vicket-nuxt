<script setup lang="ts">
import { KNOWLEDGE_REPOSITORY_KEY, TICKET_REPOSITORY_KEY } from '../types/repository'

/**
 * Advanced Support Launcher Component (SRP/OCP).
 * Now using specialized repositories (ISP).
 * Extensible via slots (OCP).
 */
const knowledge = inject(KNOWLEDGE_REPOSITORY_KEY)
const tickets = inject(TICKET_REPOSITORY_KEY)

// Robust fallback for website name (KISS)
const websiteName = computed(() => tickets?.websiteName.value || 'Vicket')

const { stripHtml } = useContent()

const isOpen = ref(false)
const searchQuery = ref('')

const { data: articlesData, status, refresh: refreshArticles } = await useAsyncData(
  'launcher-articles',
  () => knowledge ? knowledge.fetchArticles(searchQuery.value).then(res => res.data) : Promise.resolve({ data: [] }),
  { immediate: false }
)

const articles = computed(() => (articlesData.value?.data || []))
const displayArticles = computed(() => articles.value.slice(0, 5))
const isLoading = computed(() => status.value === 'pending')

const handleOpen = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    if (tickets) await tickets.fetchInit()
    await refreshArticles()
  }
}

const goToArticle = (slug: string) => {
  isOpen.value = false
  navigateTo(`/support/${slug}`)
}
</script>

<template>
  <aside 
    class="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4"
    aria-label="Support et Aide"
  >
    <!-- Popover Container -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <UCard
        v-if="isOpen"
        class="w-[350px] max-w-[calc(100vw-2rem)] shadow-2xl overflow-hidden"
        :ui="{ 
          body: 'p-0 flex flex-col', 
          root: 'ring-1 ring-[var(--ui-border)] bg-[var(--ui-bg)] rounded-2xl' 
        }"
      >
        <!-- Header -->
        <div class="p-4 bg-[var(--ui-primary)] flex items-center justify-between shadow-sm">
          <span class="font-bold text-inverted">{{ websiteName }} Aide</span>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            class="text-inverted hover:bg-white/20"
            size="xs"
            @click="isOpen = false"
          />
        </div>

        <!-- Search -->
        <div class="p-3 border-b border-[var(--ui-border)]">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Rechercher une solution..."
            size="sm"
            variant="subtle"
            class="w-full"
            :loading="isLoading"
            @keyup.enter="refreshArticles"
          />
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[350px] p-2 space-y-1 bg-[var(--ui-bg-accented)]/30">
          <button
            v-for="article in displayArticles"
            :key="article.id"
            class="w-full text-left p-3 rounded-xl hover:bg-[var(--ui-bg)] border border-transparent hover:border-[var(--ui-border)] transition-all group"
            @click="goToArticle(article.slug)"
          >
            <p class="text-sm font-bold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)] transition-colors truncate">
              {{ article.title }}
            </p>
            <p class="text-xs text-[var(--ui-text-muted)] truncate mt-1">
              {{ stripHtml(article.content) }}
            </p>
          </button>

          <div
            v-if="displayArticles.length === 0 && !isLoading"
            class="py-12 text-center"
          >
            <UIcon name="i-lucide-search-x" class="w-8 h-8 text-[var(--ui-text-muted)] mx-auto mb-2 opacity-20" />
            <p class="text-xs text-[var(--ui-text-muted)]">Aucun article trouvé.</p>
          </div>
        </div>

        <!-- Footer (OCP: Customizable via slot) -->
        <div class="p-4 bg-[var(--ui-bg)] border-t border-[var(--ui-border)]">
          <slot name="actions" />
        </div>
      </UCard>
    </Transition>

    <!-- FAB -->
    <UButton
      size="xl"
      class="rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-transform shadow-[color-mix(in_srgb,var(--ui-primary)_30%,transparent)]"
      @click="handleOpen"
    >
      <UIcon 
        :name="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-life-buoy'" 
        class="w-7 h-7 text-inverted" 
      />
      <span class="sr-only">Besoin d'aide ?</span>
    </UButton>
  </aside>
</template>
