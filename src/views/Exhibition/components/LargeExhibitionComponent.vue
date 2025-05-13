<template>
  <div class="flex justify-center items-center w-3/5 h-full flex-col">
    <div
      class="bg-primary-300 text-white text-2xl font-semibold py-2 px-4 flex justify-center items-center mb-3 w-60"
    >
      {{ props.data.name }}
    </div>
    <div class="flex flex-row justify-between items-center w-full">
      <ArrowLeft class="w-[15%] text-gray-200 hover:text-gray-300" />
      <img
        class="rounded-full bg-gray-300 aspect-square w-[70%]"
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
