<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 overflow-hidden"
    @click="handleClose"
    @wheel.prevent="handleWheel"
  >
    <!-- 关闭按钮 -->
    <button
      class="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-[101] backdrop-blur-sm"
      @click.stop="handleClose"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- 底部控制栏 -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full z-[101]" @click.stop>
      <button
        class="p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full"
        @click="zoomOut"
        title="缩小"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="text-white/90 text-sm font-medium w-12 text-center">{{ Math.round(scale * 100) }}%</span>
      <button
        class="p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full"
        @click="zoomIn"
        title="放大"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <div class="w-px h-6 bg-white/20 mx-2"></div>
      <button
        class="p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-full"
        @click="reset"
        title="重置"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- 图片容器 -->
    <div
      class="relative w-full h-full flex items-center justify-center cursor-move"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @click.stop
    >
      <img
        ref="imgRef"
        :src="imageUrl"
        alt="图片预览"
        class="max-w-none transition-transform duration-100 ease-out select-none pointer-events-none"
        :style="{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
          maxHeight: scale <= 1 ? '100%' : 'none',
          maxWidth: scale <= 1 ? '100%' : 'none'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  imageUrl: string
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

// 重置状态
const reset = () => {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

// 监听可见性变化，重置状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    reset()
  }
})

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
