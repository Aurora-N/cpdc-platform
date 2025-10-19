<template>
  <div class="flex h-full w-1/5 flex-col items-center justify-center">
    <div
      class="bg-primary-300 mb-2 flex w-45 items-center justify-center px-4 py-1 text-lg font-semibold text-white"
    >
      {{ props.data.name }}
    </div>
    <img
      class="aspect-square w-xs rounded-full bg-gray-300"
      :src="props.data.img.src"
      :alt="props.data.img.alt"
    />
  </div>
</template>

<script setup lang="ts">
import type { ExhibitionDataType } from '@/types/exhibition_data'

const props = defineProps<{
  data: ExhibitionDataType
}>()
</script>
