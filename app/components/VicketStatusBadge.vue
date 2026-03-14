<script setup lang="ts">
/**
 * OVERRIDDEN COMPONENT (Showcase White-Label).
 * This component in the parent app automatically replaces the one in the layer.
 * Radical Design Change: Glassmorphism style.
 */
interface Props {
  label: string
}

const props = defineProps<Props>()

const statusConfig = computed(() => {
  const normalized = props.label.toLowerCase()

  const configs: Record<string, { color: string, icon?: string, pulse?: boolean }> = {
    'open': { color: 'green', icon: 'i-lucide-circle-dot', pulse: true },
    'in progress': { color: 'blue', icon: 'i-lucide-refresh-cw', pulse: true },
    'closed': { color: 'gray', icon: 'i-lucide-check-circle' },
    'pending': { color: 'amber', icon: 'i-lucide-clock', pulse: true },
    'resolved': { color: 'emerald', icon: 'i-lucide-party-popper' }
  }

  return configs[normalized] || { color: 'gray' }
})
</script>

<template>
  <div
    class="inline-flex items-center px-3 py-1 rounded-lg border backdrop-blur-md transition-all duration-500 hover:scale-105"
    :class="[
      statusConfig.color === 'green' && 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
      statusConfig.color === 'blue' && 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      statusConfig.color === 'gray' && 'bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400',
      statusConfig.color === 'amber' && 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      statusConfig.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
    ]"
  >
    <UIcon
      v-if="statusConfig.icon"
      :name="statusConfig.icon"
      class="mr-2 w-4 h-4"
      :class="{ 'animate-spin-slow': statusConfig.pulse && props.label.toLowerCase() === 'in progress' }"
    />
    <span class="text-[10px] font-black uppercase tracking-[0.15em]">{{ label }}</span>
    
    <!-- Decorative Glow for "Open" status -->
    <span 
      v-if="statusConfig.pulse" 
      class="ml-2 flex h-1.5 w-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" 
    />
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
