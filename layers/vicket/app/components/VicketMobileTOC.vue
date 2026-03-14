<script setup lang="ts">
/**
 * Mobile-specific Table of Contents (SRP).
 * Uses UDrawer for a premium native feel.
 */
interface Props {
  content: string
}
defineProps<Props>()

const isOpen = ref(false)
const { extractHeadings } = useContent()

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    isOpen.value = false
  }
}
</script>

<template>
  <aside class="lg:hidden" :aria-label="$t('support.article.toc_title')">
    <div class="fixed bottom-6 right-6 z-40">
      <UButton
        icon="i-lucide-list-tree"
        size="xl"
        class="rounded-full shadow-2xl scale-110 shadow-primary-500/20"
        :aria-label="$t('support.article.toc_title')"
        @click="isOpen = true"
      />

      <UDrawer 
        v-model:open="isOpen" 
        :title="$t('support.article.toc_title')"
        description="Navigation rapide dans les sections de l'article"
      >
        <template #content>
          <div class="p-6 overflow-y-auto max-h-[70vh]">
            <nav :aria-label="$t('support.article.toc_title')">
              <ul class="space-y-4">
                <li
                  v-for="h in extractHeadings(content)"
                  :key="h.id"
                  :class="[
                    'transition-all',
                    h.depth === 3 ? 'ml-4 opacity-80' : 'font-bold text-[var(--ui-text-highlighted)]'
                  ]"
                >
                  <button
                    class="text-left w-full py-2 border-b border-gray-100 dark:border-gray-800 text-sm hover:text-primary transition-colors"
                    @click="scrollToHeading(h.id)"
                  >
                    {{ h.text }}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </template>
      </UDrawer>
    </div>
  </aside>
</template>
