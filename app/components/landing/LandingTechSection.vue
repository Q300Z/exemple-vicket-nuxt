<script setup lang="ts">
/**
 * Technical deep dive for Landing page (SRP).
 */
</script>

<template>
  <div class="mt-40 p-12 rounded-[calc(var(--ui-radius)*4)] bg-[color-mix(in_srgb,var(--ui-bg-accented)_40%,transparent)] dark:bg-[var(--ui-bg-accented)]/60 backdrop-blur-xl border border-[color-mix(in_srgb,var(--ui-primary)_15%,var(--ui-border))] shadow-3xl overflow-hidden relative group">
    <div
      class="absolute -top-24 -right-24 w-96 h-96 blur-[120px] rounded-full transition-opacity duration-1000"
      :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
    />

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
          <UIcon name="i-lucide-code" class="w-4 h-4 text-[var(--ui-primary)]" />
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-highlighted)]">{{ $t('landing.tech.badge') }}</span>
        </div>

        <h2 class="text-4xl font-bold text-[var(--ui-text-highlighted)] leading-tight">
          {{ $t('landing.tech.title_1') }} <br />
          <span class="text-gray-600 dark:text-gray-400">{{ $t('landing.tech.title_2') }}</span>
        </h2>

        <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {{ $t('landing.tech.description') }}
        </p>

        <ul class="space-y-4">
          <li v-for="item in [$t('landing.tech.item_1'), $t('landing.tech.item_2'), $t('landing.tech.item_3')]" :key="item" class="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
            <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-[var(--ui-primary)]" />
            {{ item }}
          </li>
        </ul>

        <UButton
          color="primary"
          variant="solid"
          size="xl"
          :label="$t('landing.tech.button')"
          icon="i-simple-icons-github"
          class="rounded-2xl px-8 shadow-lg"
          :ui="{ label: 'font-bold' }"
          to="https://github.com/Q300Z/exemple-vicket-nuxt"
        />
      </div>

      <!-- Code Snippet Card -->
      <div class="relative">
        <div class="absolute inset-0 blur-3xl rounded-full" :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }" />
        <div class="relative bg-[var(--ui-bg)]/60 dark:bg-gray-950/80 backdrop-blur-2xl rounded-3xl border border-[var(--ui-border)] p-8 shadow-inner">
          <div class="flex items-center gap-2 mb-6">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-[var(--ui-error)] opacity-50" />
              <div class="w-3 h-3 rounded-full bg-[var(--ui-warning)] opacity-50" />
              <div class="w-3 h-3 rounded-full bg-[var(--ui-success)] opacity-50" />
            </div>
            <div class="ml-4 text-[10px] font-mono text-[var(--ui-text-muted)] uppercase tracking-widest">Theme CSS</div>
          </div>
          <pre class="font-mono text-xs leading-relaxed"><code class="text-[var(--ui-primary)] dark:text-primary-400"><span class="text-[var(--ui-text-muted)] dark:text-gray-500">/* Le moteur injecte automatiquement */</span>
<span class="text-[var(--ui-text-highlighted)] dark:text-white">:root</span> {
  <span class="text-[var(--ui-primary)] dark:text-primary-400">--ui-primary</span>: <span class="text-[var(--ui-text-muted)] dark:text-gray-400">var(--color-indigo-500)</span>;
}

<span class="text-[var(--ui-text-highlighted)] dark:text-white">.dark</span> {
  <span class="text-[var(--ui-primary)] dark:text-primary-400">--ui-bg-accent</span>: <span class="text-[var(--ui-text-muted)] dark:text-gray-400">var(--color-gray-900)</span>;
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
