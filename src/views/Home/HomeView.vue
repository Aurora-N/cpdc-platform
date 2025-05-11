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
import { onBeforeMount } from 'vue'

const images = [
  {
    src: '/cpdc-platform/1.png',
    alt: '广彩瓷1',
  },
]

onBeforeMount(() => {
  for (let i = 1; i < 5; i++) {
    images.push({
      src: `https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image${i}.png`,
      alt: `广彩瓷${i + 1}`,
    })
  }
})
</script>
