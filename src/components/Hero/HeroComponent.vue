<template>
  <div
    class="flex h-80 w-full flex-col items-center justify-center bg-gray-200 bg-cover bg-center"
    :style="props.backgroundUrl ? `background-image: url(${backgroundUrl})` : ''"
  >
    <h1
      class="text-4xl font-extrabold"
      :class="props.titleColor ? `text-${props.titleColor}` : 'text-gray-800'"
    >
      {{ props.title }}
    </h1>
    <span v-if="props.subTitle" class="mt-8 text-lg text-gray-800">{{ props.subTitle }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  subTitle?: string
  backgroundUrl?: string
  titleColor?: string
}>()
</script>
