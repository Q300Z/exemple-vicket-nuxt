<script setup lang="ts">
/**
 * Component responsible for premium date selection (SRP).
 * Uses UCalendar inside a UPopover for a consistent Nuxt UI experience.
 */
import { parseDate } from '@internationalized/date'

interface Props {
  modelValue: string | undefined | null
  question: { id: string, label: string }
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => {
    if (!props.modelValue) return null
    try {
      // Parse YYYY-MM-DD into CalendarDate
      return parseDate(String(props.modelValue))
    } catch {
      return null
    }
  },
  set: (val) => {
    if (!val) {
      emit('update:modelValue', '')
      return
    }
    // CalendarDate .toString() returns YYYY-MM-DD
    emit('update:modelValue', val.toString())
  }
})

const { locale, t } = useI18n()

const formattedDisplay = computed(() => {
  if (!props.modelValue) return t('common.select_date')
  try {
    const [year, month, day] = String(props.modelValue).split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return String(props.modelValue)
  }
})
</script>

<template>
  <div class="pt-1">
    <UPopover :content="{ align: 'start', sideOffset: 8 }">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-calendar"
        size="lg"
        class="w-full justify-start text-left font-normal transition-all"
        :class="[
          !modelValue ? 'text-[var(--ui-text-muted)] border-[var(--ui-border-accented)]' : 'text-[var(--ui-text-highlighted)] border-[var(--ui-primary)]/50 bg-[var(--ui-primary)]/5'
        ]"
        :label="formattedDisplay"
      />

      <template #content>
        <div class="p-1 bg-[var(--ui-bg-default)] border border-[var(--ui-border-accented)] rounded-lg shadow-xl dark:shadow-primary/10">
          <UCalendar
            v-model="dateValue"
            color="primary"
            class="p-1"
          />
        </div>
      </template>
    </UPopover>
  </div>
</template>
