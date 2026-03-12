<script setup lang="ts">
import { KNOWLEDGE_REPOSITORY_KEY } from '../../../layers/vicket/app/types/repository'

/**
 * Article Detail page (Scalable Repository strategy).
 * Orchestrator Page (Clean Code).
 */
const knowledge = inject(KNOWLEDGE_REPOSITORY_KEY)
if (!knowledge) throw new Error('Knowledge Repository not provided')

const { fetchArticle } = knowledge
const route = useRoute()
const { scrollProgress } = useReadingProgress()
const { openDialog, templates } = useSupportState()

const slug = computed(() => String(route.params.slug))

// --- DATA FETCHING ---
const { data: response, status } = await fetchArticle(slug.value)

const article = computed(() => response.value?.data || null)
const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="relative transition-colors duration-500">
    <!-- Reading Progress Bar -->
    <div
      class="fixed top-[var(--ui-header-height)] left-0 h-1 z-50 transition-all duration-150 ease-out"
      :style="{ width: `${scrollProgress}%`, backgroundColor: 'var(--ui-primary)' }"
    />

    <UContainer class="py-12 sm:py-16">
      <VicketBreadcrumbs />

      <NuxtErrorBoundary>
        <!-- Loading -->
        <div v-if="isLoading" class="max-w-3xl mx-auto space-y-10 animate-pulse">
          <div class="space-y-4">
            <USkeleton class="h-16 w-full rounded-2xl" />
            <USkeleton class="h-6 w-1/3 rounded-lg" />
          </div>
          <div class="space-y-4">
            <USkeleton v-for="i in 12" :key="i" class="h-4 w-full rounded-md" />
          </div>
        </div>

        <!-- Not Found -->
        <div v-else-if="!article" class="py-20">
          <VicketEmptyState title="Article introuvable" description="Désolé, nous ne trouvons pas l'article." icon="i-lucide-file-question">
            <template #actions>
              <UButton to="/support" variant="subtle" color="neutral" class="rounded-full px-8">Retour au support</UButton>
            </template>
          </VicketEmptyState>
        </div>

        <!-- Article Detail Orchestration -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-16">
          <div class="lg:col-span-3 space-y-12">
            <SupportArticleHeader
              :title="article.title"
              :category="article.category"
              :slug="slug"
            />

            <SupportArticleContent
              :article-id="article.id"
              :content="article.content"
              :templates="templates"
              @open-ticket="openDialog"
            />
          </div>

          <SupportArticleSidebar
            :article-id="article.id"
            :content="article.content"
            @open-ticket="openDialog"
          />
        </div>

        <template #error="{ error, recover }">
          <VicketErrorFallback :error="error" @retry="recover" />
        </template>
      </NuxtErrorBoundary>
    </UContainer>
  </div>
</template>
