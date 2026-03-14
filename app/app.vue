<script setup lang="ts">
import { z } from 'zod'

const { isDialogOpen, templates, openDialog, customValidators, prefilledData, isDistractionFree } = useSupportState()
const { locale, locales, setLocale, t } = useI18n()
const route = useRoute()

// --- 3.2 Business Rules Injection (OCP) ---
// We inject a specific rule from the parent app into the layer
onMounted(() => {
  customValidators.value = {
    email: z.string().email('Email invalide')
      .refine(val => !val.endsWith('@competitor.com'), {
        message: 'Les emails de concurrents ne sont pas autorisés.'
      })
  }

  // --- 3.3 Auto-Identification (Context-Aware) ---
  // In a real app, you would get this from your Auth store
  // Here we simulate a logged-in user
  prefilledData.value = { answers: { email: 'vip-client@nuxt4.dev' } }
})

// Accessibility Audit Detection (Clean Strategy)
const isAuditMode = computed(() => route.query.audit === 'true')

useSeoMeta({
  ogSiteName: () => t('site.name'),
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  title: () => t('site.name'),
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

// Centralized DIP Injection handled by plugins/vicket-repositories.ts

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
    <VicketApiBanner v-if="!isDistractionFree" />

    <Transition
      enter-active-class="transition-transform duration-500 ease-out"
      enter-from-class="-translate-y-full"
      leave-active-class="transition-transform duration-500 ease-in"
      leave-to-class="-translate-y-full"
    >
      <div v-if="!isDistractionFree" class="sticky top-0 z-50 border-b glass-effect border-[var(--ui-border)]">
        <UHeader>
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
                :label="$t('common.support_center')"
                variant="ghost"
                color="neutral"
                size="sm"
                class="rounded-full px-4 hidden sm:flex"
              />

              <UButton
                :label="$t('common.new_ticket')"
                icon="i-lucide-plus"
                size="sm"
                class="rounded-full px-4 hidden md:flex shadow-md shadow-[color-mix(in_srgb,var(--ui-primary)_15%,transparent)]"
                :ui="{ label: 'text-inverted font-bold' }"
                @click="openDialog()"
              />
            </div>
          </template>

          <!-- Mobile Menu Content -->
          <template #content>
            <div class="p-4 space-y-4">
              <UButton
                to="/support"
                :label="$t('common.support_center')"
                variant="ghost"
                color="neutral"
                block
                class="justify-start text-lg"
                icon="i-lucide-life-buoy"
              />
              <UButton
                :label="$t('common.new_ticket')"
                icon="i-lucide-plus"
                block
                class="rounded-xl py-3 shadow-lg"
                :ui="{ label: 'text-inverted font-bold' }"
                @click="openDialog()"
              />
              
              <div class="pt-8 border-t border-[var(--ui-border)]">
                <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-muted)] mb-4 px-2">{{ $t('common.appearance') }}</p>
                <div class="flex items-center gap-4 px-2">
                  <UColorModeButton />
                  <span class="text-sm font-medium">{{ $t('common.dark_light_mode') }}</span>
                </div>
              </div>
            </div>
          </template>
        </UHeader>
      </div>
    </Transition>

    <UMain class="transition-colors duration-500">
      <NuxtPage />
    </UMain>

    <UFooter v-if="!isDistractionFree" class="border-t glass-effect py-12">
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
            :label="$t('common.open_ticket')"
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
