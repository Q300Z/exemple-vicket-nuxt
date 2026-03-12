<script setup lang="ts">
/**
 * FAQ section component (SRP).
 */
interface Props {
  faqItems: Array<{ label: string, content: string }>
  searchQuery: string
}
defineProps<Props>()
</script>

<template>
  <section v-if="faqItems?.length > 0" id="faq" class="max-w-4xl mx-auto space-y-8">
    <div class="text-center space-y-2">
      <div class="inline-flex p-3 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] text-[var(--ui-primary)] mb-2 shadow-sm">
        <UIcon name="i-lucide-help-circle" class="w-8 h-8" />
      </div>
      <h2 class="text-3xl font-bold text-[var(--ui-text-highlighted)]">
        Foire Aux Questions
      </h2>
      <p class="text-[var(--ui-text-muted)]">
        Réponses rapides aux questions les plus fréquentes.
      </p>
    </div>

    <UAccordion
      :items="faqItems"
      variant="ghost"
      class="border rounded-[var(--ui-radius)] divide-y overflow-hidden luminous-border bg-[color-mix(in_srgb,var(--ui-bg)_50%,transparent)] shadow-sm"
      :ui="{
        item: 'transition-all hover:bg-[color-mix(in_srgb,var(--ui-primary)_5%,transparent)]',
        trigger: 'p-6 font-bold text-[var(--ui-text-highlighted)] text-base',
        content: 'px-6 pb-6 text-[var(--ui-text-default)] leading-relaxed'
      }"
    >
      <template #item="{ item }">
        <VicketHighlightedText
          :text="item.content"
          :query="searchQuery"
        />
      </template>
    </UAccordion>
  </section>
</template>
