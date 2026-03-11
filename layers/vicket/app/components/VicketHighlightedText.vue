<script setup lang="ts">
/**
 * Component responsible for rendering segmented highlights without v-html (SRP).
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
        class="bg-primary-500/30 text-inherit rounded-sm px-0.5"
      >{{ segment.text }}</mark>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
