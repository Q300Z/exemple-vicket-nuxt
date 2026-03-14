<script setup lang="ts">
/**
 * Support Hero component (SRP).
 */
interface Props {
  templates: TicketTemplate[]
}
defineProps<Props>()
defineEmits(['open-ticket'])
</script>

<template>
  <div class="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--ui-text-highlighted)] leading-tight">
      {{ $t('support.hero.title_1') }} <span class="primary-gradient-text italic">{{ $t('support.hero.title_2') }}</span>
    </h1>
    <p class="text-[var(--ui-text-muted)] max-w-2xl mx-auto text-lg sm:text-xl">
      {{ $t('support.hero.description') }}
    </p>

    <div class="flex flex-wrap justify-center gap-4 pt-4">
      <UButton
        v-if="templates?.length > 0"
        icon="i-lucide-message-circle"
        size="xl"
        variant="solid"
        :label="$t('common.open_ticket')"
        class="rounded-full shadow-xl px-10 transition-transform hover:scale-105 active:scale-95"
        :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
        :ui="{ label: 'text-inverted font-bold' }"
        @click="$emit('open-ticket')"
      />
      <UButton
        to="#faq"
        :label="$t('common.view_faq')"
        variant="ghost"
        color="neutral"
        size="xl"
        class="rounded-full"
      />
    </div>
  </div>
</template>
