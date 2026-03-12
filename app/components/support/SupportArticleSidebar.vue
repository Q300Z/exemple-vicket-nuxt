<script setup lang="ts">
/**
 * Article Sidebar component (SRP).
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
    <div class="sticky top-28 space-y-12">
      <!-- Sommaire -->
      <div class="glass-effect p-6 rounded-3xl border border-[var(--ui-border)] shadow-sm">
        <VicketArticleTOC :content="content" />
      </div>

      <!-- Related Articles -->
      <VicketSidebarArticles :current-article-id="articleId" />

      <!-- CTA Support -->
      <div
        class="p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden group transition-all"
        :style="{ 
          backgroundColor: 'var(--ui-primary)', 
          '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' 
        }"
      >
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

        <div class="p-3.5 rounded-2xl bg-white/20 w-fit backdrop-blur-md">
          <UIcon name="i-lucide-headset" class="w-7 h-7 text-white" />
        </div>
        <div class="space-y-2 relative z-10 text-white">
          <p class="font-bold text-xl leading-tight">Vous n'avez pas trouvé votre réponse ?</p>
          <p class="text-sm opacity-80 leading-relaxed">Nos experts sont à votre disposition pour vous aider.</p>
        </div>
        <UButton
          block
          color="white"
          variant="solid"
          size="lg"
          class="rounded-2xl font-bold shadow-lg transition-transform hover:scale-[1.02]"
          :style="{ color: 'var(--ui-primary)' }"
          @click="$emit('open-ticket')"
        >
          Ouvrir un ticket
        </UButton>
      </div>
    </div>
  </aside>
</template>
