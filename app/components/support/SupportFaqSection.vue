<script setup lang="ts">
/**
 * Ultra-Premium FAQ section component (SRP/Elite Design).
 * Optimized for perfect Dark/Light mode reactivity.
 */
interface FAQItem {
  label: string
  content: string
}

interface Props {
  faqItems: FAQItem[]
  searchQuery: string
}
defineProps<Props>()
defineEmits(['open-support'])

const route = useRoute()
const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

// Deep Linking Logic (Elite UX)
watch(() => route.hash, (hash) => {
  if (hash && hash.startsWith('#faq-')) {
    const index = parseInt(hash.replace('#faq-', ''))
    if (!isNaN(index)) {
      openIndex.value = index
    }
  }
}, { immediate: true })
</script>

<template>
  <section v-if="faqItems?.length > 0" id="faq" class="max-w-4xl mx-auto space-y-12">
    <!-- Section Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex p-3 rounded-2xl bg-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] text-[var(--ui-primary)] mb-2 shadow-sm ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_20%,transparent)]">
        <UIcon name="i-lucide-help-circle" class="w-8 h-8" />
      </div>
      <h2 class="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
        Foire Aux <span class="primary-gradient-text italic">Questions</span>
      </h2>
      <p class="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg">
        Tout ce que vous devez savoir pour démarrer sereinement avec Vicket.
      </p>
    </div>

    <!-- Individual FAQ Cards -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="(item, index) in faqItems"
        :id="`faq-${index}`"
        :key="index"
        class="group relative overflow-hidden transition-all duration-500 rounded-[calc(var(--ui-radius)*2)] border border-[var(--ui-border)] hover:border-[color-mix(in_srgb,var(--ui-primary)_40%,var(--ui-border))] bg-[color-mix(in_srgb,var(--ui-bg)_60%,transparent)] backdrop-blur-md"
        :class="[
          openIndex === index 
            ? 'shadow-2xl shadow-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_30%,transparent)]' 
            : 'hover:shadow-lg hover:-translate-y-0.5'
        ]"
      >
        <div 
          class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 opacity-0 group-hover:opacity-100"
          :class="[openIndex === index ? 'opacity-100' : '']"
          :style="{ backgroundColor: 'var(--ui-primary)' }"
        />

        <UCollapsible :open="openIndex === index">
          <button
            class="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6 focus:outline-none"
            @click="toggle(index)"
          >
            <span 
              class="text-lg md:text-xl font-bold transition-colors duration-300"
              :class="[openIndex === index ? 'text-[var(--ui-primary)]' : 'text-neutral-900 dark:text-white']"
            >
              <VicketHighlightedText :text="item.label" :query="searchQuery" />
            </span>
            
            <div 
              class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-[var(--ui-border)] transition-all duration-500"
              :class="[openIndex === index ? 'bg-[var(--ui-primary)] border-transparent rotate-180 text-white' : 'group-hover:border-[var(--ui-primary)] group-hover:text-[var(--ui-primary)] text-neutral-500 dark:text-neutral-400']"
            >
              <UIcon name="i-lucide-chevron-down" class="w-5 h-5" />
            </div>
          </button>

          <template #content>
            <div class="px-6 md:px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
              <div class="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed border-t border-[var(--ui-border)] pt-6">
                <VicketHighlightedText :text="item.content" :query="searchQuery" />
              </div>
            </div>
          </template>
        </UCollapsible>
      </div>
    </div>

    <div class="pt-8 text-center">
      <p class="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
        D'autres questions ? 
        <UButton
          variant="link"
          color="primary"
          class="font-bold px-1"
          @click="$emit('open-support')"
        >
          Notre support est là pour vous.
        </UButton>
      </p>
    </div>
  </section>
</template>
