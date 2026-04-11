<template>
  <div
    class="mx-auto mt-12 flex w-[80%] max-w-[1200px] flex-col gap-[80px] px-4 pt-16 pb-24 md:flex-row lg:px-12"
  >
    <!-- 左侧文案区 -->
    <div class="flex w-full flex-col justify-center md:w-[45%]">
      <!-- 带 title.svg 背景的标题 -->
      <div class="relative mb-6 inline-flex w-fit items-center justify-center self-center">
        <img
          src="@/assets/gloriousNewChapterNavigator/title.svg"
          class="pointer-events-none absolute top-1/2 left-0 h-auto w-full -translate-y-1/2 object-contain"
          alt=""
        />
        <h2 class="text-glorious-title relative z-10 px-12 text-[28px] font-bold whitespace-nowrap">
          {{ chapterDataList[activeIndex]?.title }}
        </h2>
      </div>

      <!-- 中标题与正文 -->
      <div class="text-glorious-text mt-4 flex flex-col gap-6 font-medium">
        <h3 class="text-glorious-subtitle text-[20px] font-bold">
          {{ chapterDataList[activeIndex]?.subtitle }}
        </h3>
        <p class="text-[18px] leading-snug">
          {{ chapterDataList[activeIndex]?.contentZh }}
        </p>
        <p class="text-[18px] leading-snug">
          {{ chapterDataList[activeIndex]?.contentEn }}
        </p>
      </div>
    </div>

    <!-- 右侧轮播区 -->
    <div class="relative flex h-[350px] w-full items-center md:w-[55%] lg:h-[450px]">
      <div
        v-for="(imgUrl, i) in currentChapterImages"
        :key="i"
        class="absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        :class="getCarouselClass(i)"
        @click.stop="selectImageIndex(i)"
      >
        <img
          :src="imgUrl"
          class="pointer-events-none h-full w-full object-cover shadow-xl"
          alt=""
        />
      </div>

      <!-- 底部小圆点指示器：绝对定位至视觉里“第一张图片”的正下方 -->
      <div class="absolute -bottom-20 left-[30%] z-50 flex -translate-x-1/2 gap-3">
        <span
          v-for="(_, idx) in currentChapterImages"
          :key="idx"
          class="h-3 w-3 cursor-pointer rounded-full transition-colors"
          :class="currentImageIndex === idx ? 'bg-glorious-title' : 'bg-glorious-text opacity-40'"
          @click="selectImageIndex(idx)"
        ></span>
      </div>
    </div>

    <!-- 引入全屏预览组件 -->
    <ImagePreview v-model:visible="isPreviewVisible" :image-url="previewImageUrl" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { chapterDataList } from '../data/gloriousNewChapter'
import ImagePreview from '@/components/ImagePreview.vue'

const props = defineProps<{
  currentIndex: number
}>()

const activeIndex = computed(() => props.currentIndex)
const currentChapterImages = computed(() => chapterDataList[activeIndex.value]?.imageUrls || [])
const currentImageIndex = ref(0)

const isPreviewVisible = ref(false)
const previewImageUrl = ref('')

// 切换栏目时重置内部图片索引
watch(activeIndex, () => {
  currentImageIndex.value = 0
})

function selectImageIndex(index: number) {
  if (currentImageIndex.value === index) {
    // 若点击的是当前首张图片，展示大图预览
    previewImageUrl.value = currentChapterImages.value[index]
    isPreviewVisible.value = true
  } else {
    currentImageIndex.value = index
  }
}

function getCarouselClass(itemIndex: number) {
  const total = currentChapterImages.value.length
  if (total === 0) return ''

  const diff = (itemIndex - currentImageIndex.value + total) % total

  if (diff === 0) {
    return 'z-30 w-[60%] aspect-[2/3] translate-x-0 scale-100 opacity-100 filter-none' // 主图
  } else if (diff === 1) {
    return 'z-20 w-[50%] aspect-[2/3] translate-x-[70%] scale-100 opacity-70 blur-[1px]' // 第2层
  } else if (diff === 2 && total > 2) {
    return 'z-10 w-[40%] aspect-[2/3] translate-x-[150%] scale-100 opacity-40 blur-[2px]' // 第3层
  } else {
    // 处理第4张及后续数据（兜底隐藏至最前端左侧准备平滑入场）
    return 'z-0 w-[60%] aspect-[2/3] -translate-x-[20%] scale-[0.8] opacity-0 pointer-events-none'
  }
}
</script>
