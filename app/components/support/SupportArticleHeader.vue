<script setup lang="ts">
/**
 * Article Header component (SRP).
 */
interface Props {
  title: string
  category?: string
  slug: string
}
defineProps<Props>()
</script>

<template>
  <header class="space-y-8">
    <div class="space-y-4">
      <UBadge
        v-if="category"
        size="md"
        variant="subtle"
        class="rounded-full px-4"
      >
        {{ category }}
      </UBadge>
      <h1
        class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--ui-text-highlighted)] leading-[1.1]"
        :style="{ viewTransitionName: `article-title-${slug}` }"
      >
        {{ title }}
      </h1>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-[var(--ui-border)]">
      <div class="flex items-center gap-6 text-sm text-[var(--ui-text-muted)] font-medium">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-[var(--ui-bg-accented)]">
            <UIcon name="i-lucide-calendar" class="w-4 h-4 text-[var(--ui-primary)]" />
          </div>
          <span>Mis à jour récemment</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-[var(--ui-bg-accented)]">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-[var(--ui-primary)]" />
          </div>
          <span>3 min de lecture</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-link"
          variant="ghost"
          color="neutral"
          class="rounded-full hover:bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]"
          aria-label="Copier le lien de l'article"
        />
        <UButton
          icon="i-lucide-share-2"
          variant="ghost"
          color="neutral"
          class="rounded-full hover:bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]"
          aria-label="Partager l'article"
        />
      </div>
    </div>
  </header>
</template>
