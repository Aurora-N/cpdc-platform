<template>
  <div class="mt-8 flex flex-col items-center relative">
    <!-- 历史长廊标题 -->
    <div class="text-xl font-bold text-white bg-primary mb-5 py-2.5 px-4">历史长廊</div>
    <!-- 曲线切换器 -->
    <TopSelector
      ref="TopSelectorRef"
      :current-index="activeIndex"
      @Indexchange="handleIndexChange"
    />
    <!-- 主要展示区域 -->
    <section class="max-w-[1440px]">
      <!-- 历史长廊内容 -->
      <div class="flex flex-col items-center justify-center text-center">
        <div
          class="text-xl md:text-2xl font-bold mb-3 md:mb-5 mt-8 md:mt-10"
          :style="{ color: activeSection.themeColor }"
        >
          {{ activeSection.title }}
        </div>
        <div class="text-md md:text-lg" :style="{ color: activeSection.secondaryThemeColor }">
          {{ activeSection.description }}
        </div>
        <section class="w-full aspect-[4/3] relative mt-[-4rem]">
          <img
            :src="getAssetPath(activeSection.backgroundImage)"
            class="w-full h-full object-contain select-none pointer-events-none"
          />
          <!-- 三个瓷器展示 -->
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center"
          >
            <ArrowLeft
              v-show="activeIndex > 0"
              class="w-[6%] absolute top-1/2 left-0 transform -translate-x-[0.5rem] lg:-translate-x-[1rem] -translate-y-1/2 cursor-pointer text-white/60 hover:text-white/80"
              @click="handlePrevClick"
            />
            <!-- 展示区域 -->
            <div
              v-for="(item, index) in activeSection.collections"
              :key="index"
              class="w-1/3 flex justify-center items-center"
            >
              <div class="w-[calc(100%/1.6)] h-full relative">
                <img
                  :src="item.img.src"
                  class="w-full h-full object-cover select-none pointer-events-none drop-shadow-[-0.5rem_0.25rem_1px_rgba(83,109,89,0.5)] md:drop-shadow-[-0.75rem_0.32rem_1px_rgba(83,109,89,0.5)] lg:drop-shadow-[-1rem_0.5rem_1px_rgba(83,109,89,0.5)]"
                  :alt="item.img.alt"
                />
              </div>
            </div>
            <ArrowRight
              v-show="activeIndex < historyGalleryData.length - 1"
              class="w-[6%] absolute top-1/2 right-0 transform -translate-x-[-0.5rem] lg:-translate-x-[-1rem] -translate-y-1/2 cursor-pointer text-white/60 hover:text-white/80"
              @click="handleNextClick"
            />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { historyGalleryData } from '@/views/Home/data/historyGallery'
import { getAssetPath } from '@/utils/assetPath'
import TopSelector from './TopSelector.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'

const activeIndex = ref(0)

// 监听 TopSelector 组件的 Indexchange 事件
const handleIndexChange = (index: number) => {
  activeIndex.value = index
}

// 计算当前现实的模块
const activeSection = computed(() => {
  return historyGalleryData[activeIndex.value] || historyGalleryData[0]
})

const TopSelectorRef = ref<InstanceType<typeof TopSelector> | null>(null)

// 处理上一个模块点击事件
const handlePrevClick = () => {
  if (activeIndex.value > 0) {
    TopSelectorRef.value?.moveTo(activeIndex.value - 1)
  }
}

// 处理下一个模块点击事件
const handleNextClick = () => {
  if (activeIndex.value < historyGalleryData.length - 1) {
    TopSelectorRef.value?.moveTo(activeIndex.value + 1)
  }
}
</script>
