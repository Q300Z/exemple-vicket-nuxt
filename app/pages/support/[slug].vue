<script setup lang="ts">
import { SUPPORT_REPOSITORY_KEY } from '../../../layers/vicket/app/types/repository'

/**
 * Article Detail page (Scalable Repository strategy).
 * Enhanced UI with Injected Repository (DIP).
 */
const support = inject(SUPPORT_REPOSITORY_KEY)
if (!support) throw new Error('Support Repository not provided')

const { fetchArticle } = support
const route = useRoute()
const { openDialog, templates } = useSupportState()

const slug = computed(() => String(route.params.slug))

// --- DATA FETCHING (DIP: Using Injected Service) ---
const { data: response, status } = await fetchArticle(slug.value)

const article = computed(() => response.value?.data || null)
const isLoading = computed(() => status.value === 'pending')

/* ── Reading Progress Logic (SRP) ── */
const scrollProgress = ref(0)
const onScroll = () => {
  const winScroll = document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = (winScroll / height) * 100
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="relative">
    <!-- Reading Progress Bar -->
    <div
      class="fixed top-[var(--ui-header-height)] left-0 h-1 bg-primary-500 z-50 transition-all duration-150 ease-out"
      :style="{ width: `${scrollProgress}%` }"
    />

    <UContainer class="py-12 sm:py-16">
      <VicketBreadcrumbs />

      <NuxtErrorBoundary>
        <!-- Loading -->
        <div
          v-if="isLoading"
          class="max-w-3xl mx-auto space-y-10 animate-pulse"
        >
          <div class="space-y-4">
            <USkeleton class="h-16 w-full rounded-2xl" />
            <USkeleton class="h-6 w-1/3 rounded-lg" />
          </div>
          <div class="space-y-4">
            <USkeleton
              v-for="i in 12"
              :key="i"
              class="h-4 w-full rounded-md"
            />
          </div>
        </div>

        <!-- Not Found -->
        <div
          v-else-if="!article"
          class="py-20"
        >
          <VicketEmptyState
            title="Article introuvable"
            description="Désolé, nous ne trouvons pas l'article que vous recherchez. Il a peut-être été déplacé ou supprimé."
            icon="i-lucide-file-question"
          >
            <template #actions>
              <UButton
                to="/support"
                variant="subtle"
                color="neutral"
                class="rounded-full px-8"
              >
                Retour au centre de support
              </UButton>
            </template>
          </VicketEmptyState>
        </div>

        <!-- Article Detail -->
        <div
          v-else
          class="grid grid-cols-1 lg:grid-cols-4 gap-16"
        >
          <!-- Main Content -->
          <div class="lg:col-span-3 space-y-12">
            <!-- Header -->
            <header class="space-y-8">
              <div class="space-y-4">
                <UBadge
                  v-if="article.category"
                  size="md"
                  variant="subtle"
                  class="rounded-full px-4"
                >
                  {{ article.category }}
                </UBadge>
                <h1
                  class="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]"
                  :style="{ viewTransitionName: `article-title-${slug}` }"
                >
                  {{ article.title }}
                </h1>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-gray-100 dark:border-gray-800">
                <div class="flex items-center gap-6 text-sm text-gray-500 font-medium">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <UIcon
                        name="i-lucide-calendar"
                        class="w-4 h-4 text-primary"
                      />
                    </div>
                    <span>Mis à jour récemment</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <UIcon
                        name="i-lucide-clock"
                        class="w-4 h-4 text-primary"
                      />
                    </div>
                    <span>3 min de lecture</span>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UButton
                    icon="i-lucide-link"
                    variant="ghost"
                    color="neutral"
                    class="rounded-full hover:bg-primary-50 dark:hover:bg-primary-950/20"
                  />
                  <UButton
                    icon="i-lucide-share-2"
                    variant="ghost"
                    color="neutral"
                    class="rounded-full hover:bg-primary-50 dark:hover:bg-primary-950/20"
                  />
                </div>
              </div>
            </header>

            <!-- Article Body -->
            <article class="relative prose prose-lg dark:prose-invert max-w-none">
              <VicketContentRenderer :content="article.content" />
            </article>

            <!-- Feedback -->
            <div class="glass-effect p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
              <VicketArticleFeedback :article-id="article.id" />
            </div>

            <!-- Bottom Navigation -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
              <UButton
                to="/support"
                icon="i-lucide-arrow-left"
                variant="ghost"
                color="neutral"
                label="Tous les articles"
                class="rounded-full px-6 hover:bg-primary-50 dark:hover:bg-primary-950/20"
              />

              <UButton
                v-if="templates.length > 0"
                label="Besoin d'aide supplémentaire ?"
                variant="link"
                color="primary"
                class="font-bold text-base"
                @click="openDialog"
              />
            </div>
          </div>

          <!-- Sidebar (Sticky) -->
          <aside class="hidden lg:block">
            <div class="sticky top-28 space-y-12">
              <!-- Sommaire -->
              <div class="glass-effect p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
                <VicketArticleTOC :content="article.content" />
              </div>

              <!-- Related Articles (OCP: New Section) -->
              <VicketSidebarArticles :current-article-id="article.id" />

              <!-- CTA Support -->
              <div class="p-8 rounded-3xl bg-primary-600 text-white space-y-6 shadow-2xl shadow-primary-500/30 relative overflow-hidden group">
                <!-- Abstract background pattern -->
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                <div class="p-3.5 rounded-2xl bg-white/20 w-fit backdrop-blur-md">
                  <UIcon
                    name="i-lucide-headset"
                    class="w-7 h-7"
                  />
                </div>
                <div class="space-y-2 relative z-10">
                  <p class="font-bold text-xl leading-tight">
                    Vous n'avez pas trouvé votre réponse ?
                  </p>
                  <p class="text-sm text-white/80 leading-relaxed">
                    Nos experts sont à votre disposition pour vous aider.
                  </p>
                </div>
                <UButton
                  block
                  color="white"
                  variant="solid"
                  size="lg"
                  class="rounded-2xl text-primary-600 font-bold shadow-lg transition-transform hover:scale-[1.02]"
                  @click="openDialog"
                >
                  Ouvrir un ticket
                </UButton>
              </div>
            </div>
          </aside>
        </div>

        <template #error="{ error, recover }">
          <VicketErrorFallback
            :error="error"
            @retry="recover"
          />
        </template>
      </NuxtErrorBoundary>
    </UContainer>
  </div>
</template>
