<template>
  <div class="flex justify-center items-center w-1/5 h-full flex-col">
    <div
      class="bg-primary-300 text-white text-lg font-semibold py-1 px-4 flex justify-center items-center mb-2 w-45"
    >
      {{ props.data.name }}
    </div>
    <img
      class="rounded-full bg-gray-300 aspect-square w-xs"
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
