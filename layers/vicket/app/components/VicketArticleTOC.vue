<script setup lang="ts">
/**
 * Component responsible for generating a Table of Contents (SRP).
 */
interface Props {
  content: string
}

const props = defineProps<Props>()
const { extractHeadings } = useContent()

const headings = computed(() => extractHeadings(props.content))

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // Account for sticky header
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <nav
    v-if="headings.length > 0"
    class="space-y-4"
  >
    <div class="flex items-center gap-2 text-primary">
      <UIcon
        name="i-lucide-list-tree"
        class="w-4 h-4"
      />
      <span class="text-xs font-extrabold uppercase tracking-widest">Sommaire</span>
    </div>

    <ul class="space-y-2 border-l border-gray-100 dark:border-gray-800">
      <li
        v-for="h in headings"
        :key="h.id"
        :class="[
          'pl-4 -ml-px border-l transition-colors',
          h.depth === 3 ? 'ml-4 text-xs' : 'text-sm font-medium'
        ]"
      >
        <button
          class="text-left hover:text-primary transition-colors block py-1 w-full"
          @click="scrollToHeading(h.id)"
        >
          {{ h.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
