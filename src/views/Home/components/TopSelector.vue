<template>
  <div class="relative w-full">
    <!-- SVG 曲线 -->
    <svg
      ref="curveSvg"
      width="100%"
      height="auto"
      viewBox="0 0 1440 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        ref="pathRef"
        d="M0 10.4351C448.5 -33.565 850 92.935 1440 51.4351"
        stroke="#CE4B3F"
        stroke-width="2"
      />
    </svg>

    <!-- 小圆点 -->
    <img
      v-for="(pos, i) in points"
      :key="i"
      src="@/assets/historyGalleryPaths/ClickableCircle.svg"
      :class="
        cn(
          'absolute cursor-pointer w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform select-none ',
          i === activeIndex ? 'scale-0' : 'scale-100',
        )
      "
      :style="{ left: `${pos.x}%`, top: `${pos.y}%` }"
      @click="moveTo(i)"
    />

    <!-- 激活状态的实心圆点 -->
    <div
      v-show="activeIndex >= 0 && activeIndex < points.length"
      class="absolute w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 -translate-x-1/2 -translate-y-1/2 rounded-4xl select-none"
      :style="{
        left: `${points[activeIndex]?.x}%`,
        top: `${points[activeIndex]?.y}%`,
        backgroundColor: currentThemeColor,
      }"
    />

    <!-- 大圆 -->
    <img
      ref="focusCircle"
      :src="currentFocusImage"
      class="absolute w-8 h-8 md:w-10 md:h-10 -translate-x-1/2 -translate-y-1/2 scale-150 sm:scale-200 md:scale-250 select-none"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { cn } from '@/utils/cnUtils'
import { themeColors } from '@/views/Home/data/historyGallery'

gsap.registerPlugin(MotionPathPlugin)

// 定义点的类型接口
interface Point {
  x: number
  y: number
  progress: number
}

// 使用 Vite Glob 导入所有 Focus 图片
const focusImageModules = import.meta.glob('@/assets/historyGalleryPaths/Focus*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

// 从 Glob 导入结果中提取并排序图片
const focusImages = Object.keys(focusImageModules)
  .sort((a, b) => {
    // 提取文件名中的数字进行排序
    const numA = parseInt(a.match(/Focus(\d+)\.svg$/)?.[1] || '0')
    const numB = parseInt(b.match(/Focus(\d+)\.svg$/)?.[1] || '0')
    return numA - numB
  })
  .map((key) => focusImageModules[key])

const pathRef = ref<SVGPathElement | null>(null)
const focusCircle = ref<HTMLImageElement | null>(null)
const points = ref<Point[]>([])
const count = 6 // 6个点
let totalLength = 0
let currentProgress = 0 // 当前路径比例位置
let isAnimating = false

const activeIndex = ref(0)

// 计算当前主题色
const currentThemeColor = computed(() => {
  return themeColors[activeIndex.value] || themeColors[0]
})

// 计算当前 Focus 大圈图标
const currentFocusImage = computed(() => {
  return focusImages[activeIndex.value] || focusImages[0]
})

const emit = defineEmits(['Indexchange'])

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0,
  },
})

watch(
  () => props.currentIndex,
  (newIndex) => {
    activeIndex.value = newIndex
    moveTo(newIndex, false)
  },
)

onMounted(() => {
  const path = pathRef.value
  if (!path) return

  totalLength = path.getTotalLength()

  // 均匀分布6个点
  for (let i = 0; i < count; i++) {
    const progress = (i + 1) / (count + 1)
    const pt = path.getPointAtLength(totalLength * progress)
    // 将xy坐标转换为百分比
    const xPercent = (pt.x / 1440) * 100
    const yPercent = (pt.y / 61) * 100
    points.value.push({ x: xPercent, y: yPercent, progress })
    if (i === 0) {
      currentProgress = progress
    }
  }

  // 初始位置在路径起点 - 使用百分比
  const startPoint = path.getPointAtLength((1 / (count + 1)) * totalLength)
  if (focusCircle.value) {
    const startXPercent = (startPoint.x / 1440) * 100
    const startYPercent = (startPoint.y / 61) * 100
    focusCircle.value.style.left = `${startXPercent}%`
    focusCircle.value.style.top = `${startYPercent}%`
  }
})

// 点击移动动画
function moveTo(index: number, isEmit = true): void {
  const path = pathRef.value
  if (!path || !focusCircle.value) return

  if (isAnimating) return
  isAnimating = true

  const targetProgress = points.value[index].progress

  const duration = Math.abs(targetProgress - currentProgress) + 0.5

  gsap.to(focusCircle.value, {
    duration, // 动画时长
    ease: 'power2.inOut', // 平滑缓动
    motionPath: {
      path: path,
      align: path,
      alignOrigin: [0.5, 0.5],
      start: currentProgress,
      end: targetProgress,
    },
    onUpdate() {
      // 实时更新当前位置比例
      // 这里不直接取 currentProgress，因为 MotionPathPlugin 内部会管理位置
    },
    onComplete() {
      activeIndex.value = index
      currentProgress = targetProgress
      isAnimating = false
      if (isEmit) {
        emit('Indexchange', index)
      }
    },
  })
}

defineExpose({
  moveTo,
})
</script>
