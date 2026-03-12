<script setup lang="ts">
/**
 * Component responsible for rendering pre-processed content (SRP).
 * Highlighting and IDs are handled on the server for better performance.
 */
interface Props {
  content: string
}

defineProps<Props>()
</script>

<template>
  <!-- Using vk-prose for centralized, high-fidelity article styling -->
  <div class="vk-prose">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="content" />
  </div>
</template>
