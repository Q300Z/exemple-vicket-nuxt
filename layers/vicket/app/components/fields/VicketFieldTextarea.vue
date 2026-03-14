<script setup lang="ts">
/**
 * Component responsible for textarea rendering (SRP).
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

const maxLength = 1000
const currentLength = computed(() => String(props.modelValue || '').length)

const onBlur = (e: FocusEvent) => {
  const val = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', typeof val === 'string' ? val.trim() : val)
}
</script>

<template>
  <div class="space-y-1">
    <UTextarea
      v-model="internalValue"
      class="w-full"
      :rows="5"
      placeholder="Dites-nous en plus..."
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
