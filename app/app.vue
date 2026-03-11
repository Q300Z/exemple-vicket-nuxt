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

const title = 'Vicket + Nuxt 4 Demo'
const description = 'Démo du système de support Vicket intégré avec Nuxt UI v4.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      :color="false"
      class="bg-primary-500"
    />
    <UHeader class="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-800">
      <template #left>
        <NuxtLink
          to="/"
          aria-label="Accueil"
          class="hover:opacity-80 transition-opacity"
        >
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>

        <UNavigationMenu
          :items="[{ label: 'Support', to: '/support' }]"
          variant="ghost"
          class="ml-4"
        />
      </template>

      <template #right>
        <VicketStatusIndicator class="hidden lg:flex mr-2" />

        <UButton
          label="Nouveau Ticket"
          icon="i-lucide-plus"
          size="sm"
          class="rounded-full px-4"
          @click="isDialogOpen = true; if (templates.length === 0) openDialog()"
        />

        <VicketBrandingSelector />

        <UColorModeButton />

        <UButton
          to="https://vicket.app"
          target="_blank"
          icon="i-lucide-external-link"
          variant="ghost"
          color="neutral"
          class="hidden md:flex"
        >
          <span class="sr-only">Site officiel Vicket</span>
        </UButton>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter class="border-t border-gray-200 dark:border-gray-800 py-8">
      <template #left>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <AppLogo class="w-auto h-4 opacity-50" />
            <span class="text-sm font-medium text-gray-500">Demo</span>
          </div>
          <p class="text-xs text-gray-500">
            Propulsé par Nuxt UI v4 & Vicket • © {{ new Date().getFullYear() }}
          </p>
        </div>
      </template>

      <template #right>
        <div class="flex gap-4">
          <UButton
            to="https://vicket.app/fr/docs"
            target="_blank"
            icon="i-lucide-book"
            color="neutral"
            variant="ghost"
            size="sm"
          >
            <span class="sr-only">Documentation Vicket</span>
          </UButton>
          <UButton
            to="https://github.com/vicket-app"
            target="_blank"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            size="sm"
          >
            <span class="sr-only">Vicket sur GitHub</span>
          </UButton>
        </div>
      </template>
    </UFooter>

    <!-- Global Floating Launcher -->
    <VicketSupportLauncher />

    <!-- Global Support Dialog -->
    <VicketTicketDialog
      :open="isDialogOpen"
      :templates="templates"
      @update:open="isDialogOpen = $event"
    />
  </UApp>
</template>
