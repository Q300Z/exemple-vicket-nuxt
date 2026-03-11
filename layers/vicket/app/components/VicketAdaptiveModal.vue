<script setup lang="ts">
/**
 * Component responsible for adaptive modal structure (SRP).
 * Renders as a Bottom Sheet on mobile and a standard Modal on desktop.
 * Uses host project's default UModal styling.
 */
interface Props {
  open?: boolean
  modelValue?: boolean
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  modelValue: false
})
const emit = defineEmits(['update:open', 'update:modelValue', 'close'])

const device = useDevice()

const isOpen = computed({
  get: () => props.open || props.modelValue,
  set: (val) => {
    emit('update:open', val)
    emit('update:modelValue', val)
  }
})

// Functional layout only
const modalUi = computed(() => ({
  content: device.isMobile ? 'sm:max-w-none w-full !rounded-b-none' : '',
  container: device.isMobile ? 'flex items-end' : 'flex items-center justify-center'
}))
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="title"
    :description="description"
    :ui="modalUi"
  >
    <template #body>
      <div class="overflow-y-auto max-h-[85vh] sm:max-h-none">
        <slot />
      </div>
    </template>

    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </UModal>
</template>
