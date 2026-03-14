<script setup lang="ts">
/**
 * Ultra-Premium Landing Page Orchestrator (Clean Code).
 * Strictly coordinates domain blocks and global state.
 */
const { openDialog } = useSupportState()
const appConfig = useAppConfig()

const features = computed(() => appConfig.landing?.features || [])
const stats = computed(() => appConfig.landing?.stats || [])

// --- SEO (Nuxt 4 Best Practices) ---
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.index.title'),
  description: () => t('seo.index.description'),
  ogTitle: () => t('seo.index.title'),
  ogDescription: () => t('seo.index.description'),
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="relative min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500">
    <!-- Fully Dynamic Atmosphere (Optimized for Mobile Performance) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      <div
        class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[140px] animate-pulse"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
      />
      <div
        class="absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[120px]"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 10%, transparent)' }"
      />
    </div>

    <!-- Main Content Orchestration -->
    <UContainer class="relative z-10 pt-20 pb-32 sm:pt-24">
      <LandingHero @open-ticket="openDialog" />
      
      <LandingStats :stats="stats" :style="{ marginTop: 'calc(var(--section-spacing) / 2)' }" />

      <LandingFeatures :features="features" :style="{ marginTop: 'var(--section-spacing)' }" />

      <LandingTechSection :style="{ marginTop: 'var(--section-spacing)' }" />
    </UContainer>

    <!-- High-End Quote Section (Pre-footer) -->
    <section class="mt-48 py-24 bg-linear-to-b from-transparent to-[color-mix(in_srgb,var(--ui-bg-accented)_50%,transparent)]">
      <UContainer>
        <div class="text-center space-y-8 max-w-4xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-[var(--ui-text-highlighted)] italic">
            "{{ $t('landing.quote.text') }}"
          </h2>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UButton
              variant="ghost"
              color="neutral"
              :label="$t('landing.quote.discover')"
              icon="i-lucide-external-link"
              size="lg"
              class="rounded-xl"
              to="https://vicket.app/fr"
              target="_blank"
            />
            <UButton
              variant="subtle"
              color="primary"
              :label="$t('landing.quote.docs')"
              icon="i-lucide-book"
              size="lg"
              class="rounded-xl"
              to="https://vicket.app/docs"
              target="_blank"
            />
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
