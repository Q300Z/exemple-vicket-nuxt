<script setup lang="ts">
import { KNOWLEDGE_REPOSITORY_KEY, TICKET_REPOSITORY_KEY } from '../types/repository'
import type { ArticleSummary } from '../composables/useVicket'

/**
 * Advanced Support Launcher Component (SRP/OCP).
 * Now using specialized repositories (ISP).
 * Extensible via slots (OCP).
 */
const knowledge = inject(KNOWLEDGE_REPOSITORY_KEY)
const tickets = inject(TICKET_REPOSITORY_KEY)

const appConfig = useAppConfig()
// Defensive access to avoid SSR \"undefined\" errors (KISS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vicket = computed(() => (appConfig.vicket as any) || {
  name: 'Vicket',
  labels: {
    searchPlaceholder: 'Rechercher une solution...'
  }
})

// Robust fallback for website name (KISS)
const websiteName = computed(() => tickets?.websiteName?.value || vicket.value.name || 'Vicket')

const { stripHtml } = useContent()
const { ticketHistory } = useTicketHistory()

const isOpen = ref(false)
const searchQuery = ref('')
const articles = ref<ArticleSummary[]>([])
const isLoading = ref(false)
const searchInputRef = ref<{ inputRef?: { focus: () => void } } | null>(null)

const fetchResults = async () => {
  if (!knowledge) return
  isLoading.value = true
  try {
    const res = await knowledge.searchArticles(searchQuery.value)
    articles.value = res.data || []
  } catch {
    // Fail silently in launcher
  } finally {
    isLoading.value = false
  }
}

// Real-time search with debouncing (UX/Performance)
watchDebounced(searchQuery, (val) => {
  if (val.trim().length >= 2) {
    fetchResults()
  } else if (val.trim() === '') {
    // Re-fetch default articles when cleared (Discovery Mode)
    fetchResults()
  }
}, { debounce: 300 })

const isSearching = computed(() => searchQuery.value.trim().length > 0)
const displayArticles = computed(() => articles.value.slice(0, 5))

const handleOpen = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    if (tickets) await tickets.fetchInit()
    await fetchResults()
    
    // Auto-focus search input (A11y/UX)
    nextTick(() => {
      searchInputRef.value?.inputRef?.focus()
    })
  }
}

const goToArticle = (article: { id: string, slug?: string, type?: string }) => {
  isOpen.value = false
  if (article.type === 'faq') {
    navigateTo(`/support#${article.id}`)
  } else {
    navigateTo(`/support/${article.slug}`)
  }
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
          root: 'ring-1 ring-[var(--ui-border)] bg-[var(--ui-bg)] rounded-[var(--ui-radius)]' 
        }"
      >
        <!-- Header -->
        <div class="p-4 bg-[var(--ui-primary)] flex items-center justify-between shadow-sm border-b border-white/10">
          <span class="font-bold text-inverted">{{ websiteName }} {{ $t('common.support_center') }}</span>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            class="text-inverted hover:bg-white/20 rounded-full"
            size="xs"
            @click="isOpen = false"
          />
        </div>

        <!-- Search -->
        <div class="p-3 border-b border-[var(--ui-border)]">
          <UInput
            ref="searchInputRef"
            v-model="searchQuery"
            icon="i-lucide-search"
            :placeholder="$t('common.search_placeholder')"
            size="sm"
            variant="subtle"
            class="w-full"
            :loading="isLoading"
          />
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[350px] p-2 space-y-1 bg-[var(--ui-bg-accented)]/30">
          <!-- Ticket History (Showcase Feature) -->
          <div v-if="ticketHistory.length > 0 && !isSearching" class="mb-4">
            <p class="px-3 py-2 text-[10px] font-bold text-[var(--ui-primary)] uppercase tracking-widest flex items-center gap-2">
              <UIcon name="i-lucide-history" class="w-3 h-3" />
              {{ $t('vicket.my_requests') }}
            </p>
            <div class="space-y-1">
              <NuxtLink
                v-for="ticket in ticketHistory"
                :key="ticket.id"
                :to="`/ticket?token=${ticket.token}`"
                class="block px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 group"
                @click="isOpen = false"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold text-[var(--ui-text-highlighted)] group-hover:text-primary transition-colors truncate">{{ ticket.title }}</span>
                  <span class="text-[9px] font-mono opacity-50">#{{ ticket.id.slice(0, 6) }}</span>
                </div>
              </NuxtLink>
            </div>
            <div class="mx-3 mt-2 border-b border-[var(--ui-border)] opacity-50" />
          </div>

          <p v-if="displayArticles.length > 0" class="px-3 py-2 text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest">
            {{ isSearching ? $t('common.search_results') : $t('common.popular_articles') }}
          </p>
          <button
            v-for="article in displayArticles"
            :key="article.id"
            class="w-full text-left p-3 rounded-xl hover:bg-[var(--ui-bg)] border border-transparent hover:border-[var(--ui-border)] transition-all group flex flex-col gap-1 relative"
            @click="goToArticle(article)"
          >
            <div class="flex items-center justify-between gap-2">
              <VicketHighlightedText 
                :text="article.title" 
                :query="searchQuery"
                class="text-sm font-bold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)] transition-colors truncate grow"
              />
              <UBadge 
                v-if="article.type"
                size="xs" 
                variant="subtle" 
                :color="article.type === 'faq' ? 'warning' : 'primary'"
                class="rounded-md px-1 text-[8px] uppercase font-black shrink-0"
              >
                {{ article.type }}
              </UBadge>
            </div>
            <VicketHighlightedText 
              :text="stripHtml(article.content)" 
              :query="searchQuery"
              class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2"
            />
          </button>

          <div
            v-if="displayArticles.length === 0 && !isLoading"
            class="py-12 text-center"
          >
            <UIcon name="i-lucide-search-x" class="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-20" />
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ $t('common.no_results') }}</p>
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
      class="rounded-full w-14 h-14 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-transform shadow-[var(--vk-primary-muted)]"
      @click="handleOpen"
    >
      <UIcon 
        :name="isOpen ? 'i-lucide-chevron-down' : 'i-lucide-life-buoy'" 
        class="w-7 h-7 text-inverted" 
      />
      <span class="sr-only">{{ $t('vicket.need_help') }}</span>
    </UButton>
  </aside>
</template>
