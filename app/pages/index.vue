<script setup lang="ts">
/**
 * Ultra-Premium Landing Page for Vicket Implementation Example.
 * Strictly driven by Nuxt UI & Tailwind CSS Variables. No hardcoded colors.
 */
const { openDialog } = useSupportState()

const features = [
  {
    title: 'Intégration en < 15 min',
    desc: 'Un Nuxt Layer prêt à l\'emploi pour déployer votre centre d\'aide et votre billetterie instantanément.',
    icon: 'i-lucide-zap'
  },
  {
    title: 'Marque Blanche Totale',
    desc: 'Zéro logo externe. L\'expérience reste 100% fidèle à votre identity visuelle et votre domaine.',
    icon: 'i-lucide-shield-check'
  },
  {
    title: 'Automatisation IA',
    desc: 'Réduisez vos délais de réponse grâce aux workflows intelligents et au routage automatique des tickets.',
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
    <!-- Fully Dynamic Atmosphere -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[140px] animate-pulse"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
      />
      <div
        class="absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[120px]"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 10%, transparent)' }"
      />
      <div
        class="absolute bottom-0 left-1/4 w-[60%] h-[60%] bg-linear-to-t from-[color-mix(in_srgb,var(--ui-primary)_5%,transparent)] to-transparent"
      />
    </div>

    <!-- Main Content -->
    <UContainer class="relative z-10 pt-20 pb-32 sm:pt-24">
      <!-- Hero Section -->
      <div class="max-w-4xl mx-auto text-center space-y-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-bg))] border border-[color-mix(in_srgb,var(--ui-primary)_20%,var(--ui-border))] animate-in fade-in duration-1000">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ui-primary)] opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--ui-primary)]" />
          </span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-highlighted)]">Nuxt 4 industrial showcase</span>
        </div>

        <h1 class="text-6xl sm:text-8xl font-black tracking-tighter text-[var(--ui-text-highlighted)] leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Le support client <br>
          <span class="text-transparent bg-clip-text bg-linear-to-r from-[var(--ui-primary)] to-[color-mix(in_srgb,var(--ui-primary)_60%,var(--ui-text-default))]">sans compromis.</span>
        </h1>

        <p class="text-xl sm:text-2xl text-[var(--ui-text-muted)] leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Exploitez la puissance des <span class="text-[var(--ui-text-highlighted)] font-bold underline decoration-[color-mix(in_srgb,var(--ui-primary)_30%,transparent)]">CSS Variables</span> pour une marque blanche totale.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <UButton
            size="xl"
            label="Lancer la démonstration"
            icon="i-lucide-play"
            class="rounded-2xl px-10 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all"
            :style="{ '--tw-shadow-color': 'color-mix(in srgb, var(--ui-primary) 30%, transparent)' }"
            :ui="{ label: 'text-inverted font-bold' }"
            to="/support"
          />
          <UButton
            size="xl"
            variant="soft"
            color="neutral"
            label="Ouvrir un ticket"
            icon="i-lucide-plus"
            class="rounded-2xl px-10 py-4 transition-all"
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
            <div class="text-2xl font-bold text-[var(--ui-text-highlighted)]">
              {{ s.value }}
            </div>
            <div class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-default)]">
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
          class="group p-8 rounded-[32px] bg-[color-mix(in_srgb,var(--ui-bg)_80%,transparent)] backdrop-blur-sm border border-[color-mix(in_srgb,var(--ui-primary)_10%,var(--ui-border))] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] transition-all duration-500 shadow-sm hover:shadow-[var(--ui-primary)]/5"
        >
          <div class="w-14 h-14 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] flex items-center justify-center text-[var(--ui-primary)] mb-6 group-hover:scale-110 transition-transform">
            <UIcon
              :name="f.icon"
              class="w-7 h-7"
            />
          </div>
          <h2 class="text-xl font-extrabold text-[var(--ui-text-highlighted)] mb-3">
            {{ f.title }}
          </h2>
          <p class="text-sm leading-relaxed text-[var(--ui-text-muted)]">
            {{ f.desc }}
          </p>
        </div>
      </div>

      <!-- Tech Deep Dive -->
      <div class="mt-40 p-12 rounded-[48px] bg-[var(--ui-bg-accented)] border border-[var(--ui-border)] shadow-3xl overflow-hidden relative group">
        <div
          class="absolute -top-24 -right-24 w-96 h-96 blur-[120px] rounded-full transition-opacity duration-1000"
          :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
        />

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
              <UIcon
                name="i-lucide-code"
                class="w-4 h-4 text-[var(--ui-primary)]"
              />
              <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-text-highlighted)]">SOLID Architecture</span>
            </div>

            <h2 class="text-4xl font-bold text-[var(--ui-text-highlighted)] leading-tight">
              Personnalisation <br>
              <span class="text-[var(--ui-text-muted)]">au runtime.</span>
            </h2>

            <p class="text-[var(--ui-text-muted)] text-lg leading-relaxed">
              Grâce à l'utilisation des <span class="text-[var(--ui-primary)] font-semibold">CSS Variables</span> de Nuxt UI, votre application change d'identité instantanément.
            </p>

            <ul class="space-y-4">
              <li
                v-for="item in ['Réactivité totale du thème', 'Support natif Dark/Light mode', 'Optimisé pour les Nuxt Layers']"
                :key="item"
                class="flex items-center gap-3 text-sm text-[var(--ui-text-default)]"
              >
                <UIcon
                  name="i-lucide-check-circle-2"
                  class="w-5 h-5 text-[var(--ui-primary)]"
                />
                {{ item }}
              </li>
            </ul>

            <UButton
              color="primary"
              variant="solid"
              size="xl"
              label="Explorer sur GitHub"
              icon="i-simple-icons-github"
              class="rounded-2xl px-8 shadow-lg"
              :ui="{ label: 'font-bold' }"
              to="https://github.com/vicket-app"
            />
          </div>

          <!-- Code Snippet Card -->
          <div class="relative">
            <div
              class="absolute inset-0 blur-3xl rounded-full"
              :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' }"
            />
            <div class="relative bg-[var(--ui-bg)]/40 backdrop-blur-2xl rounded-3xl border border-[var(--ui-border)] p-8 shadow-inner">
              <div class="flex items-center gap-2 mb-6">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-[var(--ui-error)] opacity-50" />
                  <div class="w-3 h-3 rounded-full bg-[var(--ui-warning)] opacity-50" />
                  <div class="w-3 h-3 rounded-full bg-[var(--ui-success)] opacity-50" />
                </div>
                <div class="ml-4 text-[10px] font-mono text-[var(--ui-text-muted)] uppercase tracking-widest">
                  Theme CSS
                </div>
              </div>
              <pre class="font-mono text-xs leading-relaxed"><code class="text-[var(--ui-primary)]"><span class="text-[var(--ui-text-muted)]">/* Le moteur injecte automatiquement */</span>
<span class="text-[var(--ui-text-highlighted)]">:root</span> {
  <span class="text-[var(--ui-primary)]">--ui-primary</span>: <span class="text-[var(--ui-text-muted)]">var(--color-indigo-500)</span>;
}

<span class="text-[var(--ui-text-highlighted)]">.dark</span> {
  <span class="text-[var(--ui-primary)]">--ui-bg-accent</span>: <span class="text-[var(--ui-text-muted)]">var(--color-gray-900)</span>;
}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
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

<style scoped>
.shadow-3xl {
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.5);
}

.delay-150 { animation-delay: 150ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
.delay-700 { animation-delay: 700ms; }
.delay-1000 { animation-delay: 1000ms; }
</style>
