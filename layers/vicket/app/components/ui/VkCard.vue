<script setup lang="ts">
/**
 * Adapter for Card (DIP).
 * Wraps Nuxt UI UCard to provide a framework-agnostic interface.
 */
interface Props {
  variant?: 'solid' | 'ghost' | 'soft'
  class?: string
  ui?: Record<string, unknown>
}

defineProps<Props>()
</script>

<template>
  <UCard
    :variant="variant"
    :class="propsClass"
    :ui="ui"
  >
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>

    <slot />

    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script lang="ts">
// Handle 'class' reserved word in template
export default {
  computed: {
    propsClass() {
      // @ts-expect-error - props access
      return this.class || ''
    }
  }
}
</script>
