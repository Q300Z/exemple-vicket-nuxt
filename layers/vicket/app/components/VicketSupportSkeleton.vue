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
  <div :class="layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'">
    <div
      v-for="i in count"
      :key="i"
      class="p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6 bg-white/50 dark:bg-gray-900/50 relative overflow-hidden"
    >
      <div class="space-y-4">
        <USkeleton class="h-12 w-12 rounded-2xl" />
        <USkeleton class="h-6 w-3/4 rounded-lg" />
      </div>
      
      <div class="space-y-2 pt-2">
        <USkeleton class="h-4 w-full rounded-md" />
        <USkeleton class="h-4 w-2/3 rounded-md" />
      </div>

      <!-- Shimmer effect overlay (KISS) -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
</style>
