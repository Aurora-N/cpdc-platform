<template>
  <!-- 轮播相册 -->
  <div
    class="relative flex h-[18rem] w-full max-w-[1440px] items-center justify-center md:h-[28rem]"
  >
    <!-- 左箭头 -->
    <div
      @click="prev"
      class="absolute top-[45%] left-0 z-40 flex -translate-y-1/2 cursor-pointer transition hover:opacity-80 md:left-4 lg:left-6"
    >
      <ArrowLeft class="text-decoration-bg h-10 w-10 md:h-16 md:w-16" />
    </div>

    <!-- 轮播内容区 -->
    <div class="relative flex h-full w-full items-center justify-center">
      <div
        v-for="(resource, index) in resources"
        :key="index"
        class="absolute flex cursor-pointer flex-col items-center transition-all duration-500 ease-in-out"
        :style="getItemStyle(index)"
        @click="activeIndex = index"
      >
        <div
          class="h-[10rem] w-[16rem] overflow-hidden rounded-[3rem] md:h-[18rem] md:w-[28rem] md:rounded-[6rem]"
        >
          <video
            v-if="activeIndex === index"
            :src="resource.src"
            class="h-full w-full bg-transparent object-cover"
            autoplay
            loop
            muted
          />
          <img :src="resource.cover" :alt="resource.alt" class="h-full w-full object-cover" />
        </div>
        <div
          class="bg-decoration-bg text-decoration-text m-auto mt-4 w-fit rounded-full px-5 py-2 text-center text-sm font-semibold md:mt-8 md:px-8 md:py-3 md:text-2xl"
        >
          {{ resource.alt }}
        </div>
      </div>
    </div>

    <!-- 右箭头 -->
    <div
      @click="next"
      class="absolute top-[45%] right-0 z-40 flex -translate-y-1/2 cursor-pointer transition hover:opacity-80 md:right-4 lg:right-6"
    >
      <ArrowRight class="text-decoration-bg h-10 w-10 md:h-16 md:w-16" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageType } from '@/types/ui'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import ArrowRight from '@/components/icons/ArrowRight.vue'

// 响应式获取视口宽度以便动态调整间距
const windowWidth = ref(1024)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const isMobile = computed(() => windowWidth.value < 768)

// 动态计算轮播卡片样式配置
const GALLERY_STYLE_CONFIG = computed(() => {
  const scaleRatio = isMobile.value ? 0.55 : 1 // 移动端缩减位移距离
  return {
    0: { translateX: 0, scale: 1, opacity: 1, zIndex: 30 },
    1: { translateX: 18 * scaleRatio, scale: 0.8, opacity: 0.5, zIndex: 20 },
    2: { translateX: 32 * scaleRatio, scale: 0.6, opacity: 0.2, zIndex: 10 },
    hidden: { translateX: 32 * scaleRatio, scale: 0.4, opacity: 0, zIndex: 0 },
  }
})

const props = defineProps({
  resources: {
    type: Array<ImageType & { cover: string }>,
    default: () => [],
  },
})

const activeIndex = ref(0)

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % props.resources.length
}

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + props.resources.length) % props.resources.length
}

const getItemStyle = (index: number) => {
  const length = props.resources.length
  if (length === 0) return {}

  let offset = index - activeIndex.value

  // 处理无缝循环轮播
  if (offset > Math.floor(length / 2)) {
    offset -= length
  } else if (offset < -Math.floor(length / 2)) {
    offset += length
  }

  const absOffset = Math.abs(offset)
  const isHidden = absOffset > 2

  // 根据偏移绝对值查找配置，超出处理能力的统一使用预设隐藏层配置
  const config = isHidden
    ? GALLERY_STYLE_CONFIG.value.hidden
    : GALLERY_STYLE_CONFIG.value[
        absOffset as keyof Omit<typeof GALLERY_STYLE_CONFIG.value, 'hidden'>
      ]

  const sign = offset < 0 ? -1 : 1
  const translateX = config.translateX * sign

  return {
    transform: `translateX(${translateX}rem) scale(${config.scale})`,
    opacity: config.opacity,
    zIndex: config.zIndex,
    pointerEvents: isHidden ? ('none' as const) : ('auto' as const),
  }
}
</script>
