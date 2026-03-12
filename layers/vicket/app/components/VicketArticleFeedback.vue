<script setup lang="ts">
import { NOTIFICATION_SERVICE_KEY } from '../types/interaction'

/**
 * Component responsible for article feedback logic (SRP).
 * 100% Nuxt UI v4 compliant with semantic tokens.
 */
defineProps<{
  articleId: string
}>()

const notifications = inject(NOTIFICATION_SERVICE_KEY)
const voted = ref(false)
const feedback = ref<'positive' | 'negative' | null>(null)

const handleVote = (type: 'positive' | 'negative') => {
  voted.value = true
  feedback.value = type

  notifications?.success(
    'Merci !',
    'Votre avis nous aide à améliorer notre support.'
  )
}
</script>

<template>
  <div class="mt-12 py-8 border-t border-[var(--ui-border)] text-center space-y-4">
    <p class="text-[10px] font-bold text-[var(--ui-text-muted)] uppercase tracking-widest">
      Cet article vous a-t-il aidé ?
    </p>

    <div class="flex items-center justify-center gap-4">
      <template v-if="!voted">
        <UButton
          icon="i-lucide-thumbs-up"
          label="Oui"
          variant="outline"
          color="neutral"
          class="rounded-full px-6"
          @click="handleVote('positive')"
        />
        <UButton
          icon="i-lucide-thumbs-down"
          label="Non"
          variant="outline"
          color="neutral"
          class="rounded-full px-6"
          @click="handleVote('negative')"
        />
      </template>

      <div
        v-else
        class="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300"
      >
        <div 
          class="p-3 rounded-full shadow-inner"
          :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 10%, transparent)', color: 'var(--ui-primary)' }"
        >
          <UIcon
            :name="feedback === 'positive' ? 'i-lucide-heart' : 'i-lucide-message-square'"
            class="w-6 h-6"
          />
        </div>
        <p class="text-sm font-bold text-[var(--ui-text-highlighted)]">
          Merci pour votre retour !
        </p>
      </div>
    </div>
  </div>
</template>
