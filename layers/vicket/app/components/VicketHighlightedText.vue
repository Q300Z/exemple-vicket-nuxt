<script setup lang="ts">
/**
 * Component responsible for rendering segmented highlights without v-html (SRP).
 * Perfectly synced with the primary theme variable.
 */
interface Props {
  text: string
  query: string
}

const props = defineProps<Props>()
const { highlight } = useContent()

const segments = computed(() => highlight(props.text, props.query))
</script>

<template>
  <span>
    <template
      v-for="(segment, index) in segments"
      :key="index"
    >
      <mark
        v-if="segment.match"
        class="text-inherit rounded-sm px-0.5 transition-colors duration-500"
        :style="{ backgroundColor: 'color-mix(in srgb, var(--ui-primary) 25%, transparent)' }"
      >{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
