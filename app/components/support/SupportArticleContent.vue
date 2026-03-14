<script setup lang="ts">
/**
 * Elite Article Content area (SRP).
 * High-end bridge CTA and interactive feedback loop.
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
  <div class="lg:col-span-3 space-y-16">
    <!-- Article Body (Driven by .vk-prose) -->
    <article class="relative min-h-[300px]">
      <VicketContentRenderer :content="content" />
    </article>

    <!-- Interactive Bridge (UX Masterpiece) -->
    <div class="pt-16 border-t border-[var(--ui-border)]">
      <div class="relative group overflow-hidden p-1 rounded-[calc(var(--ui-radius)*3)] bg-linear-to-br from-[var(--ui-border)] to-transparent hover:from-[var(--ui-primary)] transition-all duration-700">
        <div class="relative bg-[var(--ui-bg)] rounded-[calc(var(--ui-radius)*2.8)] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <!-- Glow Background -->
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-[var(--ui-primary)] opacity-5 blur-[100px] group-hover:opacity-15 transition-opacity" />
          
          <div class="relative z-10 space-y-3 text-center md:text-left">
            <h2 class="text-3xl font-black tracking-tight text-[var(--ui-text-highlighted)]">
              {{ $t('support.article.feedback_question') }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300 text-lg max-w-md">
              {{ $t('support.article.feedback_desc') }}
            </p>
          </div>

          <div class="relative z-10 shrink-0">
            <VicketArticleFeedback :article-id="articleId" />
          </div>
        </div>
      </div>
    </div>

    <!-- Need More Help? Bridge -->
    <div class="relative p-10 rounded-[40px] bg-[var(--ui-bg-accented)] border border-[var(--ui-border)] flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-2 text-center md:text-left">
        <p class="text-2xl font-bold text-[var(--ui-text-highlighted)]">{{ $t('support.article.still_blocked') }}</p>
        <p class="text-gray-700 dark:text-gray-300">{{ $t('support.article.still_blocked_desc') }}</p>
      </div>
      
      <UButton
        v-if="templates.length > 0"
        :label="$t('support.article.contact_support')"
        icon="i-lucide-message-square"
        size="xl"
        class="rounded-2xl px-10 shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]"
        :ui="{ label: 'text-inverted font-bold' }"
        @click="$emit('open-ticket')"
      />
    </div>

    <!-- Navigation -->
    <div class="flex justify-center pt-4">
      <UButton
        to="/support"
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        :label="$t('support.article.discover_more')"
        class="rounded-full px-8 hover:bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] font-bold text-xs uppercase tracking-widest"
      />
    </div>
  </div>
</template>
