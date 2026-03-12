<script setup lang="ts">
/**
 * Adapter for Badge (DIP).
 * Wraps Nuxt UI UBadge to provide a framework-agnostic interface.
 */
interface Props {
  label?: string
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error'
  variant?: 'solid' | 'subtle' | 'soft' | 'outline'
  class?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
  color: 'primary',
  variant: 'solid',
  class: ''
})
</script>

<template>
  <UBadge
    :label="label"
    :color="color"
    :variant="variant"
    :class="propsClass"
  >
    <slot />
  </UBadge>
</template>

<script lang="ts">
export default {
  computed: {
    propsClass() {
      // @ts-expect-error - props access
      return this.class || ''
    }
  }
}
</script>
