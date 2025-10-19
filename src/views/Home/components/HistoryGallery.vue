<template>
  <div class="relative mt-8 flex flex-col items-center">
    <!-- 历史长廊标题 -->
    <div class="bg-primary mb-5 px-4 py-2.5 text-xl font-bold text-white">历史长廊</div>
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
          class="mt-8 mb-3 text-xl font-bold md:mt-10 md:mb-5 md:text-2xl"
          :style="{ color: activeSection.themeColor }"
        >
          {{ activeSection.title }}
        </div>
        <div class="text-md md:text-lg" :style="{ color: activeSection.secondaryThemeColor }">
          {{ activeSection.description }}
        </div>
        <section class="relative mt-[-4rem] aspect-[4/3] w-full">
          <img
            :src="getAssetPath(activeSection.backgroundImage)"
            class="pointer-events-none h-full w-full object-contain select-none"
          />
          <!-- 三个瓷器展示 -->
          <div
            class="absolute top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center"
          >
            <ArrowLeft
              v-show="activeIndex > 0"
              class="absolute top-1/2 left-0 w-[6%] -translate-x-[0.5rem] -translate-y-1/2 transform cursor-pointer text-white/60 hover:text-white/80 lg:-translate-x-[1rem]"
              @click="handlePrevClick"
            />
            <!-- 展示区域 -->
            <div
              v-for="(item, index) in activeSection.collections"
              :key="index"
              class="flex w-1/3 items-center justify-center"
            >
              <div class="relative h-full w-[calc(100%/1.6)]">
                <img
                  :src="item.img.src"
                  class="pointer-events-none h-full w-full object-cover drop-shadow-[-0.5rem_0.25rem_1px_rgba(83,109,89,0.5)] select-none md:drop-shadow-[-0.75rem_0.32rem_1px_rgba(83,109,89,0.5)] lg:drop-shadow-[-1rem_0.5rem_1px_rgba(83,109,89,0.5)]"
                  :alt="item.img.alt"
                />
              </div>
            </div>
            <ArrowRight
              v-show="activeIndex < historyGalleryData.length - 1"
              class="absolute top-1/2 right-0 w-[6%] -translate-x-[-0.5rem] -translate-y-1/2 transform cursor-pointer text-white/60 hover:text-white/80 lg:-translate-x-[-1rem]"
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
