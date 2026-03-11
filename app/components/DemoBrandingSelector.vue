<script setup lang="ts">
/**
 * Optimized UI Component for dynamic branding.
 * Includes a hidden list of colors to force Tailwind to generate the CSS variables.
 */
const { availableColors, currentPrimary, setPrimaryColor } = useBranding()

const items = computed(() => [
  availableColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    color: color,
    onSelect: () => setPrimaryColor(color),
    class: currentPrimary.value === color ? 'bg-primary-50/50 dark:bg-primary-950/20 font-bold' : ''
  }))
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', sideOffset: 8, class: 'min-w-[160px]' }"
    :ui="{ item: 'items-center' }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-palette"
      :label="currentPrimary"
      class="capitalize rounded-full hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
    />

    <!-- Leading slot: The color pastille -->
    <template #item-leading="{ item }">
      <div
        class="w-3 h-3 rounded-full shrink-0 shadow-xs border border-black/10 dark:border-white/20"
        :style="{ backgroundColor: `var(--color-${item.color}-500)` }"
      />
    </template>

    <!-- Trailing slot: The active checkmark -->
    <template #item-trailing="{ item }">
      <UIcon
        v-if="currentPrimary === item.color"
        name="i-lucide-check"
        class="w-4 h-4 text-primary-600 dark:text-primary-400 ms-auto"
      />
    </template>
  </UDropdownMenu>

  <!-- Tailwind 4 Safelist: Hidden elements to force variable generation -->
  <div class="hidden">
    <div class="bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500 bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500" />
  </div>
</template>
