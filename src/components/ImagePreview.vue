<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/95 backdrop-blur-md transition-opacity duration-300"
    @click="handleClose"
    @wheel.prevent="handleWheel"
  >
    <!-- 关闭按钮 -->
    <button
      class="absolute top-6 right-6 z-[101] rounded-full bg-white/10 p-3 text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
      @click.stop="handleClose"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- 文本信息 -->
    <div
      v-if="title || description"
      class="pointer-events-none absolute bottom-24 left-1/2 z-[101] w-[90%] max-w-2xl -translate-x-1/2 rounded-2xl bg-black/60 p-6 text-center text-white/90 backdrop-blur-xl md:bottom-8 md:left-8 md:-translate-x-0 md:text-left"
    >
      <h3 v-if="title" class="text-xl font-bold tracking-wider text-white">{{ title }}</h3>
      <p v-if="attribute" class="mt-2 text-sm font-medium text-white/60">{{ attribute }}</p>
      <p v-if="description" class="mt-3 text-base leading-relaxed text-white/80">
        {{ description }}
      </p>
    </div>

    <!-- 底部控制栏 -->
    <div
      class="absolute bottom-8 left-1/2 z-[101] flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/50 px-6 py-3 backdrop-blur-md"
      @click.stop
    >
      <button
        class="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        @click="zoomOut"
        title="缩小"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="w-12 text-center text-sm font-medium text-white/90"
        >{{ Math.round(scale * 100) }}%</span
      >
      <button
        class="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        @click="zoomIn"
        title="放大"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <div class="mx-2 h-6 w-px bg-white/20"></div>
      <button
        class="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        @click="reset"
        title="重置"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>

    <!-- 图片容器 -->
    <div
      class="relative flex h-full w-full cursor-move items-center justify-center"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @click.stop
    >
      <template v-if="mediaType === 'video'">
        <video
          ref="mediaRef"
          :src="imageUrl"
          class="max-w-none transition-transform duration-100 ease-out outline-none"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            maxHeight: scale <= 1 ? '100%' : 'none',
            maxWidth: scale <= 1 ? '100%' : 'none',
          }"
          controls
          autoplay
          loop
          @click.stop
        ></video>
      </template>
      <template v-else>
        <img
          ref="mediaRef"
          :src="imageUrl"
          alt="预览内容"
          class="pointer-events-none max-w-none transition-transform duration-100 ease-out select-none"
          :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            maxHeight: scale <= 1 ? '100%' : 'none',
            maxWidth: scale <= 1 ? '100%' : 'none',
          }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  visible: boolean
  imageUrl: string
  title?: string
  attribute?: string
  description?: string
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

// 判断媒体类型是图片还是视频
const mediaType = computed(() => {
  const url = props.imageUrl.toLowerCase()
  if (
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogg') ||
    url.endsWith('.mov')
  ) {
    return 'video'
  }
  return 'image'
})

// 重置状态
const reset = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 监听可见性变化，重置状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      reset()
    }
  },
)

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 缩放控制
const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const newScale = Math.max(0.5, Math.min(5, scale.value + delta))
  scale.value = newScale
}

const zoomIn = () => {
  scale.value = Math.min(5, scale.value + 0.2)
}

const zoomOut = () => {
  scale.value = Math.max(0.5, scale.value - 0.2)
}

// 拖拽控制
const startDrag = (e: MouseEvent) => {
  if (e.button !== 0) return // 只响应左键
  isDragging.value = true
  startX.value = e.clientX - translateX.value
  startY.value = e.clientY - translateY.value
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  translateX.value = e.clientX - startX.value
  translateY.value = e.clientY - startY.value
}

const endDrag = () => {
  isDragging.value = false
}
</script>
