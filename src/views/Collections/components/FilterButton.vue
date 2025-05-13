<template>
  <div class="bg-primary text-white w-[8rem] px-1 text-lg flex py-1 justify-center items-center">
    <span class="w-4/5 text-center">{{ props.name }}</span>
    <ArrowDown />
  </div>
</template>

<script setup lang="ts">
import type { NavItemType } from '@/types/ui'
import ArrowDown from '@/components/icons/ArrowDown.vue'

const props = defineProps<{
  name: string
  items?: NavItemType[]
}>()
</script>
