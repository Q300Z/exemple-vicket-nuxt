<script setup lang="ts">
/**
 * Trusted stats for Landing page (SRP/A11y).
 */
interface Stat {
  label: string
  value: string
}
defineProps<{ stats: Stat[] }>()
</script>

<template>
  <dl class="grid grid-cols-3 gap-8 pt-16 max-w-lg mx-auto motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000 motion-safe:delay-700">
    <div
      v-for="s in stats"
      :key="s.label"
      class="space-y-1"
    >
      <dd class="text-2xl font-bold text-neutral-900 dark:text-white">
        {{ s.value }}
      </dd>
      <dt class="text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {{ s.label }}
      </dt>
    </div>
  </dl>
</template>
