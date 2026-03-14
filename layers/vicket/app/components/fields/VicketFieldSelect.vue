<script setup lang="ts">
/**
 * Component responsible for select input rendering (SRP).
 */
interface Props {
  modelValue: unknown
  question: { id: string, label: string, options?: { label: string, value: string }[] }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <USelect
    v-model="internalValue"
    :items="question.options?.map(o => ({ label: o.label, value: o.value })) || []"
    size="lg"
    class="w-full"
  />
</template>
