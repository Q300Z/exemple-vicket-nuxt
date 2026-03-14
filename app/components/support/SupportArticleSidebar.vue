<script setup lang="ts">
/**
 * Elite Article Sidebar component (SRP).
 * Advanced blending and glowing surfaces.
 */
interface Props {
  articleId: string
  content: string
}
defineProps<Props>()
defineEmits(['open-ticket'])
</script>

<template>
  <aside class="hidden lg:block">
    <div class="sticky top-28 space-y-10">
      <!-- Table of Contents Card -->
      <div class="glass-effect p-8 rounded-[calc(var(--ui-radius)*2)] shadow-sm relative overflow-hidden group">
        <div class="absolute -right-10 -top-10 w-32 h-32 bg-[var(--ui-primary)] opacity-5 blur-3xl group-hover:opacity-10 transition-opacity" />
        <VicketArticleTOC :content="content" />
      </div>

      <!-- Related Content Section -->
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-layers" class="w-4 h-4 text-[var(--ui-primary)]" />
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ui-text-muted)]">{{ $t('support.article.related_articles') }}</span>
        </div>
        <VicketSidebarArticles :current-article-id="articleId" />
      </div>

      <!-- Dramatic CTA Support Card -->
      <div
        class="p-10 rounded-[calc(var(--ui-radius)*3)] space-y-8 shadow-3xl relative overflow-hidden group transition-all duration-700 hover:scale-[1.02]"
        :style="{ 
          backgroundColor: 'var(--ui-primary)', 
          '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 40%, transparent)' 
        }"
      >
        <!-- Animated Background Patterns -->
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div class="absolute -left-10 bottom-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

        <div class="p-4 rounded-2xl bg-white/20 w-fit backdrop-blur-xl border border-white/10">
          <UIcon
            name="i-lucide-headset"
            class="w-8 h-8 text-inverted animate-pulse"
          />
        </div>

        <div class="space-y-3 relative z-10 text-inverted">
          <h2 class="font-black text-2xl leading-tight tracking-tight">
            {{ $t('support.article.specific_question') }}
          </h2>
          <p class="text-sm opacity-100 leading-relaxed font-medium">
            {{ $t('support.article.expert_assistance') }}
          </p>
        </div>

        <UButton
          block
          color="neutral"
          variant="solid"
          size="xl"
          class="rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95 bg-white text-gray-950 dark:bg-gray-100"
          :label="$t('common.open_ticket')"
          :ui="{ 
            label: 'font-bold' 
          }"
          @click="$emit('open-ticket')"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.shadow-3xl {
  box-shadow: 0 32px 64px -12px var(--tw-shadow-color);
}
</style>
