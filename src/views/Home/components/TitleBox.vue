<template>
  <!-- 标题盒子 -->
  <div
    class="bg-primary text-md mb-3 px-2 py-1 font-bold text-white md:mb-4 md:px-3 md:py-1.5 md:text-lg lg:mb-5 lg:px-4 lg:py-2 lg:text-xl"
  >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>
