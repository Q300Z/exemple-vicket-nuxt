<script setup lang="ts">
/**
 * Features grid for Landing page (SRP).
 */
interface Feature {
  title: string
  desc: string
  icon: string
}
defineProps<{ features: Feature[] }>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40">
    <div
      v-for="f in features"
      :key="f.title"
      class="group p-8 rounded-[calc(var(--ui-radius)*2.5)] bg-[color-mix(in_srgb,var(--ui-bg)_40%,transparent)] backdrop-blur-md border border-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-border))] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] transition-all duration-500 shadow-sm hover:shadow-[var(--ui-primary)]/5"
    >
      <div class="w-14 h-14 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] flex items-center justify-center text-[var(--ui-primary)] mb-6 group-hover:scale-110 transition-transform">
        <UIcon
          :name="f.icon"
          class="w-7 h-7"
        />
      </div>
      <h2 class="text-xl font-extrabold text-[var(--ui-text-highlighted)] mb-3">
        {{ $t(f.title) }}
      </h2>
      <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {{ $t(f.desc) }}
      </p>
    </div>
  </div>
</template>
