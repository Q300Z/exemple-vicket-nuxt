<script setup lang="ts">
/**
 * Search & Filters Orchestrator (SRP).
 */
interface Props {
  categories: string[]
}
defineProps<Props>()

const modelValue = defineModel<string>({ default: '' })
const selectedCategory = defineModel<string>('category', { default: 'Tous' })

defineEmits(['search'])
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 mb-20 sticky top-[var(--ui-header-height)] z-20 pt-4">
    <div class="glass-effect p-2 rounded-3xl shadow-2xl ring-1 ring-[color-mix(in_srgb,var(--ui-primary)_10%,transparent)]">
      <VicketSearch
        v-model="modelValue"
        placeholder="Rechercher une solution, un guide..."
        size="xl"
        @search="$emit('search')"
      />
    </div>

    <!-- Category Filter -->
    <div
      v-if="categories?.length > 1"
      class="flex flex-wrap justify-center gap-2 animate-in fade-in duration-700"
    >
      <UButton
        v-for="cat in categories"
        :key="cat"
        :label="cat"
        size="md"
        :variant="selectedCategory === cat ? 'solid' : 'subtle'"
        :color="selectedCategory === cat ? 'primary' : 'neutral'"
        class="rounded-full px-6 transition-all shadow-sm"
        :ui="{ label: selectedCategory === cat ? 'font-bold' : '' }"
        @click="selectedCategory = cat"
      />
    </div>
  </div>
</template>
