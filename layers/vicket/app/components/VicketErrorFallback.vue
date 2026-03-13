<script setup lang="ts">
/**
 * Local Error Fallback component (SRP).
 * Used inside NuxtErrorBoundary to handle local failures.
 */
interface Props {
  error: unknown
  title?: string
  description?: string
}

const { openDialog } = useSupportState()

const props = withDefaults(defineProps<Props>(), {
  title: 'Échec du chargement',
  description: 'Nous ne parvenons pas à récupérer ces informations pour le moment.'
})

defineEmits(['retry'])

const reportError = () => {
  const errorDetails = props.error instanceof Error ? props.error.stack : String(props.error)
  openDialog({
    template_id: 'technique', // Assuming a 'technique' template exists
    answers: {
      'message': `Rapport d'erreur automatique :\n\n${errorDetails}`,
      'subject': `Erreur : ${props.title}`
    }
  })
}
</script>

<template>
  <div class="p-8 text-center space-y-6 bg-error-50/50 dark:bg-error-950/10 rounded-3xl border border-error-100 dark:border-error-900/30 animate-in fade-in zoom-in duration-300">
    <div class="mx-auto w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-error-500 shadow-sm">
      <UIcon
        name="i-lucide-wifi-off"
        class="w-8 h-8"
      />
    </div>

    <div class="space-y-1">
      <p class="font-bold text-gray-900 dark:text-white">
        {{ title }}
      </p>
      <p class="text-xs text-gray-500 max-w-xs mx-auto">
        {{ description }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <UButton
        icon="i-lucide-refresh-cw"
        label="Réessayer"
        variant="soft"
        color="error"
        class="rounded-full px-6"
        @click="$emit('retry')"
      />
      <UButton
        icon="i-lucide-alert-circle"
        label="Envoyer un rapport"
        variant="ghost"
        color="neutral"
        class="rounded-full px-6 text-xs"
        @click="reportError"
      />
    </div>
  </div>
</template>
