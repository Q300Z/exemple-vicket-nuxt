<script setup lang="ts">
/**
 * Component responsible for single text input rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', typeof val === 'string' ? val.trimStart() : val)
})

const maxLength = computed(() => props.question.id === 'title' ? 100 : 255)
const currentLength = computed(() => String(props.modelValue || '').length)

// Final trim on blur for robustness (OCP)
const onBlur = (e: FocusEvent) => {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', typeof val === 'string' ? val.trim() : val)
}
</script>

<template>
  <div class="space-y-1">
    <UInput
      v-model="internalValue"
      size="lg"
      class="w-full"
      :maxlength="maxLength"
      @blur="onBlur"
    />
    <div class="flex justify-end">
      <span 
        class="text-[9px] font-bold transition-colors uppercase tracking-widest"
        :class="currentLength >= maxLength ? 'text-error-500' : 'text-[var(--ui-text-muted)]'"
      >
        {{ currentLength }} / {{ maxLength }}
      </span>
    </div>
  </div>
</template>
