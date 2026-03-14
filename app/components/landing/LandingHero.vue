<script setup lang="ts">
/**
 * Landing Page Hero component (SRP).
 */
defineEmits(['open-ticket'])
</script>

<template>
  <div class="max-w-4xl mx-auto text-center space-y-10">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-bg))] border border-[color-mix(in_srgb,var(--ui-primary)_20%,var(--ui-border))] animate-in fade-in duration-1000">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ui-primary)] opacity-75" />
        <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--ui-primary)]" />
      </span>
      <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-highlighted)]">Vicket Industrial Implementation</span>
    </div>

    <h1 class="text-6xl sm:text-8xl font-black tracking-tighter text-[var(--ui-text-highlighted)] leading-[0.9] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-700 motion-safe:delay-150">
      Le Support Client <br/>
      <span class="text-transparent bg-clip-text bg-linear-to-r from-[var(--ui-primary)] to-[color-mix(in_srgb,var(--ui-primary)_70%,var(--ui-text-highlighted))]">
        réinventé.
      </span>
    </h1>

    <p class="text-xl sm:text-2xl text-[var(--ui-text-muted)] leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      L'implémentation de référence du <span class="text-[var(--ui-text-highlighted)] font-bold underline decoration-[color-mix(in_srgb,var(--ui-primary)_30%,transparent)]">Vicket Support Layer</span> pour Nuxt 4.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
      <UButton
        size="xl"
        label="Lancer la démonstration"
        icon="i-lucide-play"
        class="rounded-2xl px-10 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all"
        :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
        :ui="{ label: 'text-inverted font-bold' }"
        to="/support"
      />
      <UButton
        size="xl"
        variant="soft"
        color="neutral"
        label="Ouvrir un ticket"
        icon="i-lucide-plus"
        class="rounded-2xl px-10 py-4 transition-all"
        @click="$emit('open-ticket')"
      />
    </div>
  </div>
</template>
