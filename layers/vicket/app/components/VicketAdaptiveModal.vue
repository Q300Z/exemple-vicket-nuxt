<script setup lang="ts">
/**
 * Component responsible for adaptive modal/drawer transitions (OCP).
 * Switches between Modal (Desktop) and Drawer (Mobile) automatically.
 */
interface Props {
  open: boolean
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: ''
})

const emit = defineEmits(['update:open'])
const { isMobile } = useDevice()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})
</script>

<template>
  <template v-if="isMobile">
    <UDrawer
      v-model:open="isOpen"
      :title="title"
      :description="description"
    >
      <slot />
    </UDrawer>
  </template>
  <template v-else>
    <UModal
      v-model:open="isOpen"
      :title="title"
      :description="description"
    >
      <slot />
    </UModal>
  </template>
</template>
