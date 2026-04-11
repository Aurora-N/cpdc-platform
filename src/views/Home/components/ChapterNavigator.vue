<template>
  <div class="relative my-12 flex w-full items-center justify-center overflow-visible px-4">
    <div class="relative aspect-[797/298] w-full max-w-[797px]">
      <!-- 路径背景 -->
      <img
        src="@/assets/gloriousNewChapterNavigator/path.svg"
        class="pointer-events-none absolute top-0 left-0 h-full w-full object-contain"
        alt=""
      />

      <!-- 顶部左侧 (index: 1 -> 2.png) -->
      <button
        class="absolute top-0 left-0 flex aspect-square w-[17.6%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300"
        @click="selectIndex(1)"
        :class="activeIndex === 1 ? 'scale-110' : 'scale-100'"
      >
        <img
          :src="activeIndex === 1 ? activeBgUrl : normalBgUrl"
          class="pointer-events-none absolute top-0 left-0 h-full w-full"
          alt=""
        />
        <img
          src="@/assets/gloriousNewChapterNavigator/buttonIcons/2.png"
          class="relative z-10 h-[48%] w-[48%] object-contain transition-opacity duration-300"
          :class="activeIndex === 1 ? 'opacity-100' : 'opacity-60'"
          alt=""
        />
      </button>

      <!-- 顶部中间 (index: 0 -> 1.png) -->
      <button
        class="absolute top-0 left-[50%] flex aspect-square w-[29%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300"
        @click="selectIndex(0)"
        :class="activeIndex === 0 ? 'scale-110' : 'scale-100'"
      >
        <img
          :src="activeIndex === 0 ? activeBgUrl : normalBgUrl"
          class="pointer-events-none absolute top-0 left-0 h-full w-full"
          alt=""
        />
        <img
          src="@/assets/gloriousNewChapterNavigator/buttonIcons/1.png"
          class="relative z-10 h-[44%] w-[44%] object-contain transition-opacity duration-300"
          :class="activeIndex === 0 ? 'opacity-100' : 'opacity-60'"
          alt=""
        />
      </button>

      <!-- 顶部右侧 (index: 3 -> 4.png) -->
      <button
        class="absolute top-0 right-0 flex aspect-square w-[17.6%] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300"
        @click="selectIndex(3)"
        :class="activeIndex === 3 ? 'scale-110' : 'scale-100'"
      >
        <img
          :src="activeIndex === 3 ? activeBgUrl : normalBgUrl"
          class="pointer-events-none absolute top-0 left-0 h-full w-full"
          alt=""
        />
        <img
          src="@/assets/gloriousNewChapterNavigator/buttonIcons/4.png"
          class="relative z-10 h-[48%] w-[48%] object-contain transition-opacity duration-300"
          :class="activeIndex === 3 ? 'opacity-100' : 'opacity-60'"
          alt=""
        />
      </button>

      <!-- 底部中间 (index: 2 -> 3.png) -->
      <button
        class="absolute bottom-0 left-[50%] flex aspect-square w-[18.7%] -translate-x-1/2 translate-y-1/3 items-center justify-center rounded-full transition-all duration-300"
        @click="selectIndex(2)"
        :class="activeIndex === 2 ? 'scale-110' : 'scale-100'"
      >
        <img
          :src="activeIndex === 2 ? activeBgUrl : normalBgUrl"
          class="pointer-events-none absolute top-0 left-0 h-full w-full"
          alt=""
        />
        <img
          src="@/assets/gloriousNewChapterNavigator/buttonIcons/3.png"
          class="relative z-10 h-[57%] w-[57%] object-contain transition-opacity duration-300"
          :class="activeIndex === 2 ? 'opacity-100' : 'opacity-60'"
          alt=""
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

// 动态响应外部传入的 modelValue
const activeIndex = computed(() => props.modelValue ?? 0)

function selectIndex(index: number) {
  emit('update:modelValue', index)
  emit('change', index)
}

// 动态导入静态资源 url
const activeBgUrl = new URL(
  '@/assets/gloriousNewChapterNavigator/activeButtonBg.svg',
  import.meta.url,
).href
const normalBgUrl = new URL(
  '@/assets/gloriousNewChapterNavigator/normalButtonBg.svg',
  import.meta.url,
).href
</script>
