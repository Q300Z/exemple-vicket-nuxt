<script setup lang="ts">
/**
 * Article Content and Interaction area (SRP).
 */
interface Props {
  articleId: string
  content: string
  templates: TicketTemplate[]
}
defineProps<Props>()
defineEmits(['open-ticket'])
</script>

<template>
  <div class="lg:col-span-3 space-y-12">
    <!-- Body -->
    <article class="relative prose prose-lg max-w-none">
      <VicketContentRenderer :content="content" />
    </article>

    <!-- Feedback -->
    <div class="glass-effect p-8 rounded-3xl border border-[var(--ui-border)] shadow-sm">
      <VicketArticleFeedback :article-id="articleId" />
    </div>

    <!-- Bottom Navigation & CTA -->
    <div class="space-y-12 pt-12 border-t border-[var(--ui-border)]">
      <div class="bg-[var(--ui-bg-accented)] p-8 rounded-3xl border border-[var(--ui-border)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-1 text-center md:text-left">
          <p class="text-xl font-bold text-[var(--ui-text-highlighted)]">Cet article n'a pas répondu à votre question ?</p>
          <p class="text-[var(--ui-text-muted)]">Nos experts sont là pour vous accompagner 24/7.</p>
        </div>
        <UButton
          v-if="templates.length > 0"
          label="Contacter le support"
          icon="i-lucide-message-square"
          size="xl"
          class="rounded-2xl px-8 shadow-md"
          @click="$emit('open-ticket')"
        />
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        <UButton
          to="/support"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          label="Retour aux articles"
          class="rounded-full px-6 hover:bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]"
        />
      </div>
    </div>
  </div>
</template>
