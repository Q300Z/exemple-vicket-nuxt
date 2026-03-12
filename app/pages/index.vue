<script setup lang="ts">
/**
 * Ultra-Premium Landing Page Orchestrator (Clean Code).
 * Strictly coordinates domain blocks and global state.
 */
const { openDialog } = useSupportState()

const features = [
  {
    title: 'Intégration en < 15 min',
    desc: 'Un Nuxt Layer prêt à l\'emploi pour déployer votre centre d\'aide instantanément.',
    icon: 'i-lucide-zap'
  },
  {
    title: 'Marque Blanche Totale',
    desc: 'Zéro logo externe. L\'expérience reste 100% fidèle à votre identité visuelle.',
    icon: 'i-lucide-shield-check'
  },
  {
    title: 'Automatisation IA',
    desc: 'Réduisez vos délais de réponse grâce aux workflows intelligents.',
    icon: 'i-lucide-bot'
  }
]

const stats = [
  { label: 'Gain de temps', value: '-40%' },
  { label: 'Satisfaction client', value: '98%' },
  { label: 'Setup technique', value: 'Simple' }
]
</script>

<template>
  <div class="relative min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-500">
    <!-- Fully Dynamic Atmosphere (Abstracted Logic) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
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
      
      <LandingStats :stats="stats" />

      <LandingFeatures :features="features" />

      <LandingTechSection />

      <!-- High-End Quote Footer (Last orchestration block) -->
      <footer class="mt-48 text-center space-y-8 border-t border-[var(--ui-border)] pt-24 pb-12">
        <h2 class="text-3xl font-bold text-[var(--ui-text-highlighted)] italic">
          "Le support client nouvelle génération."
        </h2>
        <div class="flex items-center justify-center gap-4">
          <UButton
            variant="ghost"
            color="neutral"
            label="Découvrir Vicket.app"
            icon="i-lucide-external-link"
            size="lg"
            to="https://vicket.app/fr"
            target="_blank"
          />
        </div>
        <p class="text-xs text-[var(--ui-text-muted)] font-medium tracking-widest uppercase mt-12">
          © 2026 Vicket Showcase • Driven by CSS Variables
        </p>
      </footer>
    </UContainer>
  </div>
</template>
