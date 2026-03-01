<template>
  <div class="flex h-full w-3/5 flex-col items-center justify-center">
    <div
      class="bg-primary-300 mb-3 flex w-60 items-center justify-center px-4 py-2 text-2xl font-semibold text-white"
    >
      {{ props.data.name }}
    </div>
    <div class="flex w-full flex-row items-center justify-between">
      <ArrowLeft class="w-[15%] text-gray-200 hover:text-gray-300" />
      <img
        class="aspect-square w-[70%] rounded-full bg-gray-300"
        :src="props.data.img.src"
        :alt="props.data.img.alt"
      />
      <ArrowRight class="w-[15%] text-gray-200 hover:text-gray-300" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExhibitionDataType } from '@/types/exhibition_data'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'

const props = defineProps<{
  data: ExhibitionDataType
}>()
</script>
