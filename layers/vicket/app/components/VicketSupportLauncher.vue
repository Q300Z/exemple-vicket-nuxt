<script setup lang="ts">
/**
 * Component responsible for the Support launcher (SRP).
 * Logic-focused, style-agnostic.
 */
const { openDialog } = useSupportState()
const { fetchInit, websiteName } = useSupportData()
const { stripHtml } = useContent()

const isOpen = ref(false)
const searchQuery = ref('')

const { data: articlesData, refresh: refreshArticles } = await useAsyncData(
  'launcher-articles',
  () => $fetch('/api/vicket/articles', { params: { q: searchQuery.value } }),
  { immediate: false }
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
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
    <!-- Popover Center -->
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
        class="w-[350px] max-w-[calc(100vw-2rem)] shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800"
        :ui="{ body: 'p-0 flex flex-col', rounded: 'rounded-2xl' }"
      >
        <!-- Header -->
        <div class="p-4 bg-primary text-primary-foreground flex items-center justify-between">
          <span class="font-bold">{{ websiteName }} Aide</span>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="isOpen = false"
          />
        </div>

        <!-- Search -->
        <div class="p-3 border-b border-neutral-100 dark:border-neutral-800">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Rechercher..."
            size="sm"
            @keyup.enter="refreshArticles"
          />
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[300px] p-2 space-y-1">
          <button
            v-for="article in displayArticles"
            :key="article.id"
            class="w-full text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            @click="goToArticle(article.slug)"
          >
            <p class="text-sm font-semibold truncate">
              {{ article.title }}
            </p>
            <p class="text-xs text-neutral-500 truncate mt-0.5">
              {{ stripHtml(article.content) }}
            </p>
          </button>
          <div
            v-if="displayArticles.length === 0"
            class="py-8 text-center text-xs text-neutral-500"
          >
            Aucun résultat.
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
          <UButton
            block
            label="Ouvrir un ticket"
            icon="i-lucide-message-square"
            @click="openDialog"
          />
        </div>
      </UCard>
    </Transition>

    <!-- FAB -->
    <UButton
      icon="i-lucide-life-buoy"
      size="xl"
      class="rounded-full shadow-lg"
      @click="handleOpen"
    >
      <span class="sr-only">Support</span>
    </UButton>
  </div>
</template>
