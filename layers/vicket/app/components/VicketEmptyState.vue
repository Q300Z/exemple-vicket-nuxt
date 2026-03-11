<script setup lang="ts">
/**
 * Component responsible for stylized empty states (SRP).
 */
interface Props {
  title: string
  description: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-search-x'
})
</script>

<template>
  <div class="py-20 text-center space-y-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 animate-in fade-in duration-500">
    <div class="relative mx-auto w-24 h-24">
      <!-- Decorative background circles -->
      <div class="absolute inset-0 bg-primary-500/10 rounded-full animate-pulse" />
      <div class="absolute inset-2 bg-primary-500/20 rounded-full" />

      <div class="relative flex items-center justify-center h-full text-primary">
        <UIcon
          :name="icon"
          class="w-12 h-12"
        />
      </div>
    </div>

    <div class="space-y-2 max-w-sm mx-auto px-4">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-gray-500 dark:text-gray-500">
        {{ description }}
      </p>
    </div>

    <slot name="actions" />
  </div>
</template>
