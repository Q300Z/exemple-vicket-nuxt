<script setup lang="ts">
/**
 * UI Adapter for Button (DIP Pattern).
 * Wraps Nuxt UI but can easily be replaced by Vuetify or Tailwind CSS.
 * Provides a framework-agnostic interface for the Vicket layer.
 */
interface Props {
  label?: string
  icon?: string
  loading?: boolean
  disabled?: boolean
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'white'
  variant?: 'solid' | 'soft' | 'ghost' | 'link' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  icon: undefined,
  color: 'primary',
  variant: 'solid',
  size: 'md',
  type: 'button',
  to: undefined,
  target: undefined
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <UButton
    v-bind="props"
    @click="$emit('click', $event)"
  >
    <slot />
  </UButton>
</template>
