<script setup lang="ts">
/**
 * Global Error Page (SRP).
 * Handles 404, 500 and other fatal application errors.
 * Perfectly synced with the primary theme.
 */
interface NuxtError {
  statusCode: number
  statusMessage: string
  message: string
}

const props = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })

const errorConfig = computed(() => {
  const code = props.error.statusCode
  if (code === 404) {
    return {
      title: 'Page introuvable',
      description: 'Désolé, la page que vous recherchez semble avoir disparu dans le néant numérique.',
      icon: 'i-lucide-map-pin-off'
    }
  }
  return {
    title: 'Une erreur est survenue',
    description: props.error.message || 'Notre équipe technique a été prévenue et travaille sur le problème.',
    icon: 'i-lucide-alert-triangle'
  }
})
</script>

<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center p-6 bg-[var(--vk-surface-tint)] transition-colors duration-500">
      <UCard class="max-w-md w-full shadow-2xl glass-effect border-[var(--ui-border)]">
        <div class="text-center space-y-6 py-8">
          <div class="relative mx-auto w-24 h-24">
            <div
              class="absolute inset-0 rounded-full animate-pulse"
              :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-error) 10%, transparent)' }"
            />
            <div class="relative flex items-center justify-center h-full text-[var(--ui-error)]">
              <UIcon
                :name="errorConfig.icon"
                class="w-12 h-12"
              />
            </div>
          </div>

          <div class="space-y-2">
            <h1 class="text-3xl font-extrabold tracking-tight text-[var(--ui-text-highlighted)]">
              {{ errorConfig.title }}
            </h1>
            <p class="text-[var(--ui-text-muted)] text-sm leading-relaxed">
              {{ errorConfig.description }}
            </p>
          </div>

          <div class="flex flex-col gap-3 pt-4">
            <UButton
              label="Retour à l'accueil"
              variant="solid"
              color="primary"
              size="lg"
              block
              class="rounded-xl shadow-lg"
              :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
              :ui="{ label: 'text-[var(--ui-bg)] font-bold' }"
              @click="handleError"
            />
            <UButton
              to="https://vicket.app"
              target="_blank"
              label="Contacter le support externe"
              variant="ghost"
              color="neutral"
              size="sm"
              block
            />
          </div>
        </div>
      </UCard>
    </div>
  </UApp>
</template>
