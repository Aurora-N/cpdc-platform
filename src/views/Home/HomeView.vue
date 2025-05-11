<template>
  <CarouselComponent
    :images="images"
    :autoplay="false"
    :autoplayInterval="4000"
    :swipeThreshold="50"
  />
</template>

<script setup lang="ts">
import CarouselComponent from '@/views/Home/components/CarouselComponent.vue'

const images = [
  {
    src: '/cpdc-platform/1.png',
    alt: '广彩瓷1',
  },
  {
    src: '/cpdc-platform/1.png',
    alt: '广彩瓷2',
  },
  {
    src: '/cpdc-platform/1.png',
    alt: '广彩瓷3',
  },
  // 可以添加更多图片
]
</script>
