<script setup lang="ts">
/**
 * Component responsible only for rendering ticket statuses (SRP).
 * Open for new statuses (OCP).
 */
interface Props {
  label: string
}

const props = defineProps<Props>()

const statusConfig = computed(() => {
  const normalized = props.label.toLowerCase()

  const configs: Record<string, { color: string, icon?: string, pulse?: boolean }> = {
    'open': { color: 'success', icon: 'i-lucide-circle-dot', pulse: true },
    'in progress': { color: 'primary', icon: 'i-lucide-refresh-cw', pulse: true },
    'closed': { color: 'neutral', icon: 'i-lucide-check-circle' },
    'pending': { color: 'warning', icon: 'i-lucide-clock', pulse: true },
    'resolved': { color: 'success', icon: 'i-lucide-party-popper' }
  }

  return configs[normalized] || { color: 'neutral' }
})
</script>

<template>
  <UBadge
    :color="statusConfig.color"
    variant="solid"
    class="px-3 py-1 rounded-full transition-all duration-300"
    :class="{ 'badge-pulse': statusConfig.pulse }"
  >
    <UIcon
      v-if="statusConfig.icon"
      :name="statusConfig.icon"
      class="mr-1.5 w-3.5 h-3.5"
    />
    {{ label }}
  </UBadge>
</template>
