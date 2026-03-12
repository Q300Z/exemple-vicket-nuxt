<script setup lang="ts">
import { VicketNetworkError, VicketAuthError } from '../utils/errors'

/**
 * Simplified Error Switcher (KISS).
 * Uses Nuxt UI's UAlert for high fidelity and less custom CSS.
 */
interface Props {
  error: Error | null
}

const props = defineProps<Props>()
defineEmits(['retry'])

const errorConfig = computed(() => {
  if (props.error instanceof VicketNetworkError) {
    return { title: 'Erreur réseau', icon: 'i-lucide-wifi-off', color: 'error' as const }
  }
  if (props.error instanceof VicketAuthError) {
    return { title: 'Accès restreint', icon: 'i-lucide-lock', color: 'warning' as const }
  }
  return { title: 'Erreur', icon: 'i-lucide-alert-circle', color: 'error' as const }
})
</script>

<template>
  <div v-if="props.error" class="flex flex-col items-center justify-center p-8 space-y-6">
    <UAlert
      :title="errorConfig.title"
      :description="props.error.message || 'Une erreur inattendue est survenue.'"
      :icon="errorConfig.icon"
      :color="errorConfig.color"
      variant="subtle"
      class="max-w-md border border-[var(--ui-border)] rounded-2xl p-6"
    />

    <div class="flex gap-4">
      <UButton
        label="Réessayer"
        icon="i-lucide-refresh-cw"
        size="lg"
        class="rounded-2xl"
        @click="$emit('retry')"
      />
      <UButton
        to="/support"
        label="Accueil"
        variant="ghost"
        color="neutral"
        size="lg"
        class="rounded-2xl"
      />
    </div>
  </div>
</template>
