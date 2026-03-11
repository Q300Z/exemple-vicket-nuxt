<script setup>
import { SUPPORT_REPOSITORY_KEY } from '../layers/vicket/app/types/repository'
import { NOTIFICATION_SERVICE_KEY } from '../layers/vicket/app/types/interaction'

const { isDialogOpen, templates, openDialog } = useSupportState()
const supportRepository = useSupportData()
const notificationService = useNotificationService()

// Provide the repository globally (DIP)
provide(SUPPORT_REPOSITORY_KEY, supportRepository)
provide(NOTIFICATION_SERVICE_KEY, notificationService)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

const title = 'Vicket Nuxt 4 Showcase'
const description = 'Démo industrielle du système de support Vicket.'

useSeoMeta({
  title,
  description
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <!-- Unified Appbar -->
    <UHeader class="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2 group"
        >
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">V</div>
          <span class="font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">Vicket Demo</span>
        </NuxtLink>

        <UNavigationMenu
          :items="[{ label: 'Centre d\'aide', to: '/support', icon: 'i-lucide-life-buoy' }]"
          variant="link"
          class="ml-4"
        />
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <!-- Dynamic Branding (Demo Feature) -->
          <DemoBrandingSelector />

          <UColorModeButton />

          <UButton
            label="Nouveau Ticket"
            icon="i-lucide-plus"
            size="sm"
            class="rounded-full px-4 hidden md:flex"
            @click="isDialogOpen = true; if (templates.length === 0) openDialog()"
          />

          <UButton
            to="https://vicket.app/fr"
            target="_blank"
            icon="i-lucide-external-link"
            variant="ghost"
            color="neutral"
            size="sm"
          >
            <span class="sr-only">Site officiel</span>
          </UButton>
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter class="border-t border-gray-100 dark:border-gray-900 py-12">
      <template #left>
        <p class="text-xs text-gray-500 font-medium uppercase tracking-widest">
          © 2026 Vicket Industrial Implementation • Nuxt 4 & SOLID
        </p>
      </template>

      <template #right>
        <div class="flex gap-4">
          <UButton
            to="https://github.com/vicket-app"
            target="_blank"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>
      </template>
    </UFooter>

    <!-- Global Vicket Layers Components -->
    <VicketSupportLauncher />
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

/* Fluid Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ui-primary) 10%, transparent);
  border-radius: 10px;
  border: 3px solid transparent;
  background-clip: content-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--ui-primary);
}
</style>
