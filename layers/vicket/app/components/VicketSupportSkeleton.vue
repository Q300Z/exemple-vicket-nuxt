<script setup lang="ts">
/**
 * Component responsible for structural loading states (SRP).
 * Perfectly matches the article card layout.
 */
interface Props {
  count?: number
  layout?: 'grid' | 'list'
}

withDefaults(defineProps<Props>(), {
  count: 3,
  layout: 'grid'
})
</script>

<template>
  <div :class="layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-4'">
    <div
      v-for="i in count"
      :key="i"
      class="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 bg-white/50 dark:bg-gray-900/50"
    >
      <div class="flex justify-between items-start">
        <USkeleton class="h-6 w-3/4 rounded-lg" />
        <USkeleton class="h-4 w-4 rounded-full" />
      </div>
      <div class="space-y-2">
        <USkeleton class="h-4 w-full rounded-md" />
        <USkeleton class="h-4 w-2/3 rounded-md" />
      </div>
    </div>
  </div>
</template>
