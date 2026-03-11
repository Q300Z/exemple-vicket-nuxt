<script setup lang="ts">
/**
 * UI Component to demonstrate dynamic branding (White-label capability).
 */
const { availableColors, currentPrimary, setPrimaryColor } = useBranding()

const items = computed(() => [
  availableColors.map(color => ({
    label: color.charAt(0).toUpperCase() + color.slice(1),
    icon: 'i-lucide-palette',
    color: color,
    onSelect: () => setPrimaryColor(color)
  }))
])
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', sideOffset: 8 }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-lucide-palette"
      :label="currentPrimary"
      class="capitalize"
    />

    <template #item-leading="{ item }">
      <div
        class="w-3 h-3 rounded-full"
        :class="`bg-${item.color}-500`"
      />
    </template>
  </UDropdownMenu>
</template>
