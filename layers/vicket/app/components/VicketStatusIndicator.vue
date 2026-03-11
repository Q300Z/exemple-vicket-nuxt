<script setup lang="ts">
/**
 * Component responsible for displaying system status (SRP).
 */
const { statusColor, statusLabel } = useSystemStatus()
</script>

<template>
  <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm animate-in fade-in duration-700">
    <div class="relative flex h-2 w-2">
      <span
        class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        :class="`bg-${statusColor}-400`"
      />
      <span
        class="relative inline-flex rounded-full h-2 w-2"
        :class="`bg-${statusColor}-500`"
      />
    </div>
    <span class="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
      {{ statusLabel }}
    </span>
  </div>
</template>
