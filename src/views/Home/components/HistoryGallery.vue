<template>
  <div class="relative mt-8 flex flex-col items-center">
    <!-- 历史长廊标题 -->
    <TitleBox title="历史长廊" />
    <!-- 曲线切换器 -->
    <TopSelector
      ref="TopSelectorRef"
      :current-index="activeIndex"
      @Indexchange="handleIndexChange"
    />
    <!-- 主要展示区域 -->
    <section class="w-full max-w-[1440px] overflow-hidden">
      <!-- 历史长廊内容 -->
      <transition :name="slideDirection" mode="out-in">
        <div
          :key="activeIndex"
          class="flex w-full flex-col items-center justify-center text-center"
          :style="{ '--slide-duration': `${slideDuration / 2}s` }"
        >
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
                class="absolute top-1/2 left-0 z-10 w-[6%] -translate-x-[0.5rem] -translate-y-1/2 transform cursor-pointer text-white/60 hover:text-white/80 lg:-translate-x-[1rem]"
                @click="handlePrevClick"
              />
              <!-- 展示区域 -->
              <div
                v-for="(item, index) in activeSection.collections"
                :key="index"
                class="group flex w-1/3 cursor-pointer items-center justify-center transition-transform hover:scale-105"
                @click="openPreview(item)"
              >
                <div
                  class="relative aspect-square w-[calc(100%/1.6)] transition-all duration-300 group-hover:brightness-110"
                  :style="{
                    '--shadow-color': hexToRgba(activeSection.themeColor, 0.5),
                    transform: item.offsetY ? `translateY(${item.offsetY})` : 'none',
                  }"
                >
                  <img
                    :src="item.img.src"
                    class="pointer-events-none h-full w-full object-contain drop-shadow-[-0.5rem_0.25rem_1px_var(--shadow-color)] select-none md:drop-shadow-[-0.75rem_0.32rem_1px_var(--shadow-color)] lg:drop-shadow-[-1rem_0.5rem_1px_var(--shadow-color)]"
                    :alt="item.img.alt"
                  />
                </div>
              </div>
              <ArrowRight
                v-show="activeIndex < historyGalleryData.length - 1"
                class="absolute top-1/2 right-0 z-10 w-[6%] -translate-x-[-0.5rem] -translate-y-1/2 transform cursor-pointer text-white/60 hover:text-white/80 lg:-translate-x-[-1rem]"
                @click="handleNextClick"
              />
            </div>
          </section>
        </div>
      </transition>
    </section>

    <!-- 图片预览 -->
    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImageUrl"
      :title="previewTitle"
      :attribute="previewAttribute"
      :description="previewDescription"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { historyGalleryData } from '@/views/Home/data/historyGallery'
import { getAssetPath } from '@/utils/assetPath'
import TopSelector from './TopSelector.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'
import TitleBox from './TitleBox.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import type { CollectionDataType } from '@/types/collection_data'

const activeIndex = ref(0)
const slideDirection = ref('slide-left')
const slideDuration = ref(0.8) // 默认动画时间

// 监听 TopSelector 组件的 Indexchange 事件
const handleIndexChange = (index: number, duration: number = 0.8) => {
  slideDirection.value = index > activeIndex.value ? 'slide-left' : 'slide-right'
  activeIndex.value = index
  slideDuration.value = duration
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

// 预览状态
const previewVisible = ref(false)
const previewImageUrl = ref('')
const previewTitle = ref('')
const previewAttribute = ref('')
const previewDescription = ref('')

const openPreview = (item: CollectionDataType) => {
  previewImageUrl.value = item.img.src
  previewTitle.value = item.name
  previewAttribute.value = item.attribute
  previewDescription.value = item.description
  previewVisible.value = true
}

// 辅助方法：将HEX颜色转为RGBA
const hexToRgba = (hex: string, alpha: number = 0.5) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return `rgba(0,0,0,${alpha})`
  let c = hex.substring(1).split('')
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]]
  }
  const colorStr = c.join('')
  const r = parseInt(colorStr.slice(0, 2), 16)
  const g = parseInt(colorStr.slice(2, 4), 16)
  const b = parseInt(colorStr.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all var(--slide-duration, 0.4s) ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(3%);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-3%);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-3%);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(3%);
}
</style>
