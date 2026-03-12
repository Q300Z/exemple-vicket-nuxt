<script setup>
import { 
  KNOWLEDGE_REPOSITORY_KEY, 
  TICKET_REPOSITORY_KEY, 
  ENGAGEMENT_REPOSITORY_KEY 
} from '../layers/vicket/app/types/repository'
import { NOTIFICATION_SERVICE_KEY } from '../layers/vicket/app/types/interaction'

const { isDialogOpen, templates, openDialog } = useSupportState()
const { knowledge, tickets, engagement } = useSupportData()
const notificationService = useNotificationService()
const { locale, locales, setLocale } = useI18n()

// Provide for DIP (Specialized interfaces)
provide(KNOWLEDGE_REPOSITORY_KEY, knowledge)
provide(TICKET_REPOSITORY_KEY, tickets)
provide(ENGAGEMENT_REPOSITORY_KEY, engagement)
provide(NOTIFICATION_SERVICE_KEY, notificationService)

useHead({
  htmlAttrs: { lang: locale.value }
})

const items = computed(() => [
  locales.value.map(l => ({
    label: l.name,
    onSelect: () => setLocale(l.code),
    checked: locale.value === l.code,
    type: 'checkbox'
  }))
])
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <!-- A11y Announcer (KISS Strategy for ARIA) -->
    <div id="vicket-a11y-announcer" class="sr-only" aria-live="polite" aria-atomic="true" />


    <UHeader class="sticky top-0 z-50 border-b glass-effect border-[var(--ui-border)]">

      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-[var(--ui-radius)] bg-[var(--ui-primary)] flex items-center justify-center text-inverted font-bold transition-transform group-hover:scale-110 shadow-lg shadow-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
            V
          </div>
          <span class="font-bold text-[var(--ui-text-highlighted)] tracking-tight">Vicket Demo</span>
        </NuxtLink>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <!-- i18n Switcher -->
          <UDropdownMenu :items="items">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-languages"
              class="rounded-full"
              aria-label="Changer la langue"
            />
          </UDropdownMenu>

          <DemoBrandingSelector />
          <UColorModeButton />

          <UButton
            label="Nouveau Ticket"
            icon="i-lucide-plus"
            size="sm"
            class="rounded-full px-4 hidden md:flex shadow-md shadow-[color-mix(in_srgb,var(--ui-primary)_15%,transparent)]"
            :ui="{ label: 'text-inverted font-bold' }"
            @click="isDialogOpen = true; if (templates.length === 0) openDialog()"
          />
        </div>
      </template>
    </UHeader>

    <UMain class="transition-colors duration-500">
      <NuxtPage />
    </UMain>

    <UFooter class="border-t glass-effect py-12 mt-20">
      <template #left>
        <p class="text-xs text-[var(--ui-text-muted)] font-medium uppercase tracking-widest">
          © 2026 Vicket Showcase • Dynamic White-label Engine
        </p>
      </template>
    </UFooter>

    <VicketSupportLauncher>
      <template #actions>
        <UButton
          block
          size="lg"
          label="Ouvrir un ticket"
          icon="i-lucide-message-square"
          class="rounded-xl shadow-lg shadow-[color-mix(in_srgb,var(--ui-primary)_15%,transparent)]"
          :ui="{ label: 'text-inverted font-bold' }"
          @click="isDialogOpen = true; if (templates.length === 0) openDialog()"
        />
      </template>
    </VicketSupportLauncher>
    <VicketTicketDialog
      :open="isDialogOpen"
      :templates="templates"
      @update:open="isDialogOpen = $event"
    />
  </UApp>
</template>

<style>
/* Global Reactive Theme Accents */
::selection {
  background-color: color-mix(in srgb, var(--ui-primary) 30%, transparent);
  color: var(--ui-primary);
}
</style>
