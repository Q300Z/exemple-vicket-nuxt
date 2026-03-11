<script setup lang="ts">
/**
 * Ultra-Premium Landing Page for Vicket Implementation Example.
 * Demonstrates high-end styling on top of the agnostic Vicket layer.
 */
const { openDialog } = useSupportState()

const features = [
  {
    title: 'Intégration en < 15 min',
    desc: 'Un Nuxt Layer prêt à l\'emploi pour déployer votre centre d\'aide et votre billetterie instantanément.',
    icon: 'i-lucide-zap',
    color: 'amber'
  },
  {
    title: 'Marque Blanche Totale',
    desc: 'Zéro logo externe. L\'expérience reste 100% fidèle à votre identité visuelle et votre domaine.',
    icon: 'i-lucide-shield-check',
    color: 'indigo'
  },
  {
    title: 'Automatisation IA',
    desc: 'Réduisez vos délais de réponse grâce aux workflows intelligents et au routage automatique des tickets.',
    icon: 'i-lucide-bot',
    color: 'emerald'
  }
]

const stats = [
  { label: 'Gain de temps', value: '-40%' },
  { label: 'Satisfaction client', value: '98%' },
  { label: 'Setup technique', value: 'Simple' }
]
</script>

<template>
  <div class="relative min-h-screen bg-white dark:bg-gray-950 font-sans antialiased selection:bg-primary-100 selection:text-primary-900">
    <!-- Sophisticated Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] animate-pulse" />
      <div class="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px]" />
      <div class="absolute bottom-0 left-1/4 w-[50%] h-[50%] bg-linear-to-t from-primary-50/50 to-transparent dark:from-primary-950/10" />
    </div>

    <!-- Main Content -->
    <UContainer class="relative z-10 pt-24 pb-32 sm:pt-32">
      <!-- Nav Teaser -->
      <nav class="flex items-center justify-between mb-16 px-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
            V
          </div>
          <span class="font-bold text-gray-900 dark:text-white tracking-tight">Vicket Demo</span>
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/support"
            class="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >Documentation</NuxtLink>
          <UButton
            size="sm"
            label="Site Officiel"
            variant="ghost"
            icon="i-lucide-external-link"
            to="https://vicket.app/fr"
            target="_blank"
          />
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="max-w-4xl mx-auto text-center space-y-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/50 animate-in fade-in duration-1000">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-primary-700 dark:text-primary-300">Nuxt 4 Reference Implementation</span>
        </div>

        <h1 class="text-6xl sm:text-8xl font-black tracking-tighter text-gray-900 dark:text-white leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Le support client <br>
          <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-indigo-400">sans compromis.</span>
        </h1>

        <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Intégrez une expérience de support haut de gamme à votre application Nuxt. Gardez le contrôle total sur votre code, vos données et votre marque.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <UButton
            size="xl"
            label="Lancer la démonstration"
            icon="i-lucide-play"
            class="rounded-2xl px-10 py-4 shadow-2xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all"
            to="/support"
          />
          <UButton
            size="xl"
            variant="soft"
            color="neutral"
            label="Ouvrir un ticket"
            icon="i-lucide-plus"
            class="rounded-2xl px-10 py-4"
            @click="openDialog"
          />
        </div>

        <!-- Trust Stats -->
        <div class="grid grid-cols-3 gap-8 pt-16 max-w-lg mx-auto animate-in fade-in duration-1000 delay-700">
          <div
            v-for="s in stats"
            :key="s.label"
            class="space-y-1"
          >
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ s.value }}
            </div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- High-End Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40">
        <div
          v-for="f in features"
          :key="f.title"
          class="group p-8 rounded-[32px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500"
        >
          <div :class="`w-14 h-14 rounded-2xl bg-${f.color}-50 dark:bg-${f.color}-950/30 flex items-center justify-center text-${f.color}-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`">
            <UIcon
              :name="f.icon"
              class="w-7 h-7"
            />
          </div>
          <h3 class="text-xl font-extrabold text-gray-900 dark:text-white mb-3">
            {{ f.title }}
          </h3>
          <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {{ f.desc }}
          </p>
        </div>
      </div>

      <!-- Tech Deep Dive (OCP/LSP Demo) -->
      <div class="mt-40 p-12 rounded-[48px] bg-gray-900 dark:bg-black border border-white/5 shadow-3xl overflow-hidden relative group">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/20 blur-[120px] rounded-full group-hover:bg-primary-600/30 transition-colors duration-1000" />

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <UIcon
                name="i-lucide-code"
                class="w-4 h-4 text-primary-400"
              />
              <span class="text-[10px] font-bold uppercase tracking-widest text-white/70">Solid Implementation Architecture</span>
            </div>

            <h2 class="text-4xl font-bold text-white leading-tight">
              Une architecture pensée <br>
              <span class="text-gray-500">pour les ingénieurs.</span>
            </h2>

            <p class="text-gray-400 text-lg leading-relaxed">
              Ne vous contentez pas d'un widget iframe. Ce projet utilise les principes <span class="text-white font-semibold">SOLID</span> pour offrir une intégration native, testable et ultra-performante.
            </p>

            <ul class="space-y-4">
              <li
                v-for="item in ['DIP: Inversion de dépendances pour les tests', 'OCP: Formulaires extensibles sans modification', 'LSP: Fournisseurs de cache interchangeables']"
                :key="item"
                class="flex items-center gap-3 text-sm text-gray-300"
              >
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="w-5 h-5 text-primary-500"
                />
                {{ item }}
              </li>
            </ul>

            <UButton
              color="white"
              variant="solid"
              size="xl"
              label="Explorer sur GitHub"
              icon="i-simple-icons-github"
              class="rounded-2xl px-8"
              to="https://github.com/vicket-app"
            />
          </div>

          <!-- Code Snippet Card -->
          <div class="relative">
            <div class="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full" />
            <div class="relative bg-gray-800/40 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-inner">
              <div class="flex items-center gap-2 mb-6">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500/50" />
                  <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div class="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div class="ml-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  nuxt.config.ts
                </div>
              </div>
              <pre class="font-mono text-sm leading-relaxed"><code class="text-primary-300"><span class="text-purple-400">export default</span> <span class="text-yellow-400">defineNuxtConfig</span>({
  <span class="text-gray-400">// Étendre le moteur Vicket</span>
  <span class="text-emerald-400">extends</span>: [<span class="text-orange-300">'./layers/vicket'</span>],

  <span class="text-gray-400">// Votre style, vos règles</span>
  <span class="text-emerald-400">ui</span>: {
    <span class="text-primary-400">primary</span>: <span class="text-orange-300">'indigo'</span>,
    <span class="text-primary-400">radius</span>: <span class="text-orange-300">'1.5rem'</span>
  }
})</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Final CTA -->
      <footer class="mt-48 text-center space-y-8 border-t border-gray-100 dark:border-gray-900 pt-24 pb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white italic">
          "Gardez vos clients satisfaits, restez focus sur votre produit."
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
        <p class="text-xs text-gray-400 font-medium tracking-widest uppercase mt-12">
          © 2026 Vicket Industrial Implementation • Crafted with Nuxt 4 & SOLID
        </p>
      </footer>
    </UContainer>
  </div>
</template>

<style scoped>
.shadow-3xl {
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
}

/* Entry Animations Fine-tuning */
.delay-150 { animation-delay: 150ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
.delay-700 { animation-delay: 700ms; }
.delay-1000 { animation-delay: 1000ms; }
</style>
