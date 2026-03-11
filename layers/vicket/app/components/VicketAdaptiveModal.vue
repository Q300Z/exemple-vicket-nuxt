<script setup lang="ts">
/**
 * Component responsible for adaptive modal rendering (SRP).
 * Renders as a Bottom Sheet on mobile and a standard Modal on desktop.
 */
interface Props {
  open?: boolean
  modelValue?: boolean
  title: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  modelValue: false,
  description: 'Support Dialog'
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

// Logic to handle mobile-first ergonomics (Bottom Sheet vs centered Modal)
const modalUi = computed(() => ({
  content: device.isMobile ? 'sm:max-w-none w-full !rounded-b-none !rounded-t-3xl' : 'rounded-2xl',
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
      <div class="overflow-y-auto max-h-[85vh] sm:max-h-none p-1">
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
