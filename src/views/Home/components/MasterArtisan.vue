<template>
  <!-- 技艺匠人区域 -->
  <section class="relative -mt-10 flex flex-col items-center md:-mt-20 lg:-mt-40">
    <!-- 背景装饰图案 -->
    <img
      src="/decorationbg.png"
      class="pointer-events-none absolute -top-5 left-0 h-auto w-[90vw] max-w-[1129px] -translate-x-[44%] opacity-10 md:-top-32 lg:-top-74"
      alt=""
    />
    <TitleBox title="技艺匠人" />
    <GalleryComponent :resources="masterArtisanResources" />
  </section>
</template>

<script setup lang="ts">
import TitleBox from './TitleBox.vue'
import GalleryComponent from './GalleryComponent.vue'
import { masterArtisanResources } from '@/views/Home/data/masterArtisanImages'
</script>
