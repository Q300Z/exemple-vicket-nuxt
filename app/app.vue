<script setup lang="ts">
const { isDialogOpen, templates, openDialog } = useSupportState()
const { locale, locales, setLocale } = useI18n()
const route = useRoute()

// Accessibility Audit Detection (Clean Strategy)
const isAuditMode = computed(() => route.query.audit === 'true')

useSeoMeta({
  ogSiteName: 'Vicket Support Showcase',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  bodyAttrs: {
    class: computed(() => isAuditMode.value ? 'a11y-audit-mode' : '')
  },
  style: computed(() => isAuditMode.value ? [
    { innerHTML: `
      .a11y-audit-mode, .a11y-audit-mode * { 
        color: #000000 !important; 
        background-color: #ffffff !important;
        background-image: none !important;
        border-color: #000000 !important;
        text-shadow: none !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        transition: none !important;
        animation: none !important;
      }
      .dark .a11y-audit-mode, .dark .a11y-audit-mode * {
        color: #ffffff !important;
        background-color: #000000 !important;
        border-color: #ffffff !important;
      }
    ` }
  ] : [])
})

// Centralized DIP Injection (Clean Architecture)
useVicketInjection()

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


    <!-- API Health Status (Industrial Transparency) -->
    <VicketApiBanner />

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
            to="/support"
            label="Centre d'aide"
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-full px-4 hidden sm:flex"
          />

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

      <!-- Mobile Menu Content -->
      <template #content>
        <div class="p-4 space-y-4">
          <UButton
            to="/support"
            label="Centre d'aide"
            variant="ghost"
            color="neutral"
            block
            class="justify-start text-lg"
            icon="i-lucide-life-buoy"
          />
          <UButton
            label="Nouveau Ticket"
            icon="i-lucide-plus"
            block
            class="rounded-xl py-3 shadow-lg"
            :ui="{ label: 'text-inverted font-bold' }"
            @click="isDialogOpen = true; if (templates.length === 0) openDialog()"
          />
          
          <div class="pt-8 border-t border-[var(--ui-border)]">
            <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-muted)] mb-4 px-2">Apparence</p>
            <div class="flex items-center gap-4 px-2">
              <UColorModeButton />
              <span class="text-sm font-medium">Mode Sombre / Clair</span>
            </div>
          </div>
        </div>
      </template>
    </UHeader>

    <UMain class="transition-colors duration-500">
      <NuxtPage />
    </UMain>

    <UFooter class="border-t glass-effect py-12">
      <template #left>
        <p class="text-xs text-[var(--ui-text-muted)] font-medium uppercase tracking-widest">
          © 2026 Vicket Showcase • Dynamic White-label Engine
        </p>
      </template>

      <template #right>
        <div class="flex items-center gap-4">
          <UButton 
            icon="i-simple-icons-x" 
            variant="ghost" 
            color="neutral" 
            aria-label="Twitter / X"
          />
          <UButton 
            icon="i-simple-icons-github" 
            variant="ghost" 
            color="neutral" 
            to="https://github.com/Q300Z/exemple-vicket-nuxt" 
            target="_blank"
            aria-label="GitHub"
          />
        </div>
      </template>
    </UFooter>

    <ClientOnly>
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
    </ClientOnly>

    <LazyVicketTicketDialog />
  </UApp>
</template>

<style>
/* Global Reactive Theme Accents */
::selection {
  background-color: var(--vk-primary-muted);
  color: var(--vk-primary);
}
</style>
