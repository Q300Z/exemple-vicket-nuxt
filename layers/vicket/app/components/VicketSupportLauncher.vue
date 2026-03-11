<script setup lang="ts">
/**
 * Component responsible for the Floating Action Button launcher (SRP).
 */
const { openDialog } = useSupportState()
const { fetchInit, websiteName } = useSupportData()
const { stripHtml } = useContent()

const isOpen = ref(false)
const searchQuery = ref('')

// --- DATA FETCHING (DIP: Using Repository) ---
const { data: articlesData, refresh: refreshArticles } = await useAsyncData(
  'launcher-articles',
  () => $fetch('/api/vicket/articles', { params: { q: searchQuery.value } }),
  {
    immediate: false, // Fetch only when opened
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }
)

const articles = computed(() => articlesData.value?.data || [])
const displayArticles = computed(() => (articles.value || []).slice(0, 5))

const handleOpen = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await fetchInit()
    await refreshArticles()
  }
}

const goToArticle = (slug: string) => {
  isOpen.value = false
  navigateTo(`/support/${slug}`)
}

const onSearch = () => {
  refreshArticles()
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
    <!-- Mini Help Center Popover -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="w-[350px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col ring-1 ring-black/5"
      >
        <!-- Header -->
        <div class="p-6 bg-primary-600 text-white space-y-1">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">
              {{ websiteName }} Aide
            </h3>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="white"
              size="xs"
              class="rounded-full"
              @click="isOpen = false"
            />
          </div>
          <p class="text-xs text-white/80">
            Recherchez une réponse ou contactez-nous.
          </p>
        </div>

        <!-- Search -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Comment pouvons-nous aider ?"
            size="md"
            class="w-full"
            :ui="{ rounded: 'rounded-xl' }"
            @keyup.enter="onSearch"
            @blur="onSearch"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto max-h-[300px] p-4 space-y-4">
          <div
            v-if="(displayArticles?.length || 0) > 0"
            class="space-y-2"
          >
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
              {{ searchQuery ? 'Résultats de recherche' : 'Articles suggérés' }}
            </p>
            <div class="space-y-1">
              <button
                v-for="article in displayArticles"
                :key="article.id"
                class="w-full text-left p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors group"
                @click="goToArticle(article.slug)"
              >
                <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                  {{ article.title }}
                </p>
                <p class="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {{ stripHtml(article.content) }}
                </p>
              </button>
            </div>
          </div>

          <div
            v-else
            class="py-8 text-center"
          >
            <p class="text-sm text-gray-500">
              Aucun résultat trouvé.
            </p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <UButton
            block
            label="Envoyer un message"
            icon="i-lucide-message-square"
            size="lg"
            class="rounded-xl shadow-lg shadow-primary-500/10"
            @click="openDialog"
          />
        </div>
      </div>
    </Transition>

    <!-- FAB Button -->
    <UButton
      icon="i-lucide-life-buoy"
      size="xl"
      class="rounded-full w-14 h-14 shadow-2xl shadow-primary-500/40 transform hover:scale-110 active:scale-95 transition-all"
      :class="{ 'rotate-90': isOpen }"
      @click="handleOpen"
    />
  </div>
</template>
