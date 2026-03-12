<script setup lang="ts">
/**
 * Component responsible for stylized empty states (SRP).
 * Updated with theme variables and more vibrant visuals.
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
  <div class="py-20 text-center space-y-10 bg-[var(--ui-bg-accented)] rounded-[40px] border-2 border-dashed border-[var(--ui-border)] animate-in fade-in zoom-in-95 duration-700">
    <div class="relative mx-auto w-32 h-32 flex items-center justify-center">
      <!-- Decorative background with primary color-mix -->
      <div 
        class="absolute inset-0 rounded-full animate-pulse blur-xl opacity-20"
        :style="{ backgroundColor: 'var(--ui-primary)' }"
      />
      <div 
        class="absolute inset-4 rounded-[32px] rotate-12 transition-transform group-hover:rotate-0 duration-500"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
      />

      <div class="relative flex items-center justify-center h-full" :style="{ color: 'var(--ui-primary)' }">
        <UIcon
          :name="icon"
          class="w-16 h-16 drop-shadow-sm"
        />
      </div>
    </div>

    <div class="space-y-3 max-w-sm mx-auto px-6">
      <h3 class="text-2xl font-black tracking-tight text-[var(--ui-text-highlighted)]">
        {{ title }}
      </h3>
      <p class="text-[var(--ui-text-muted)] leading-relaxed text-base">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="pt-2">
      <slot name="actions" />
    </div>
  </div>
</template>
