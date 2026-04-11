<template>
  <!-- 华彩新章区域 -->
  <section class="relative flex flex-col items-center">
    <!-- 背景装饰图案 -->
    <img
      src="/decorationbg.png"
      class="pointer-events-none absolute top-210 right-0 h-auto w-[90vw] max-w-[1129px] translate-x-[44%] opacity-10 md:top-105 lg:top-74"
      alt=""
    />
    <TitleBox title="华彩新章" />

    <ChapterNavigator v-model="currentIndex" class="mt-32 mb-12" @change="onNavigatorChange" />

    <ChapterDisplayArea v-model:currentIndex="currentIndex" />
  </section>
</template>

<script setup lang="ts">
import TitleBox from './TitleBox.vue'
import ChapterNavigator from './ChapterNavigator.vue'
import ChapterDisplayArea from './ChapterDisplayArea.vue'
import { ref } from 'vue'

const currentIndex = ref(0)
const onNavigatorChange = (index: number) => {
  currentIndex.value = index
  console.log('华彩新章切换到索引：', index)
}
</script>
