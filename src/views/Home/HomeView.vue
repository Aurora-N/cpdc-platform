<template>
  <CarouselComponent
    :images="images"
    :autoplay="true"
    :autoplayInterval="4000"
    :swipeThreshold="50"
  />
  <main class="hero-background">
    <HistoryGallery />
    <MasterArtisan />
    <GloriousNewChapter />
  </main>
</template>

<script setup lang="ts">
import CarouselComponent from '@/views/Home/components/CarouselComponent.vue'
import HistoryGallery from './components/HistoryGallery.vue'
import MasterArtisan from './components/MasterArtisan.vue'
import GloriousNewChapter from './components/GloriousNewChapter.vue'

const images = [
  {
    src: '/cpdc-platform/home/p1.jpg',
    alt: '广彩瓷1',
  },
  {
    src: '/cpdc-platform/home/p2.jpg',
    alt: '广彩诞生',
  },
  {
    src: '/cpdc-platform/home/p3.jpg',
    alt: '数字焕新',
  },
]
</script>

<style scoped>
.hero-background {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),
    url('/cpdc-platform/herobg.png');

  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>
