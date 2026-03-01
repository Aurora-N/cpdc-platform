<template>
  <div class="flex flex-col" ref="rootEl">
    <div
      class="bg-primary text-md hover:bg-primary-600 flex w-[5rem] cursor-pointer items-center justify-center p-0.5 text-white select-none md:w-[8rem] md:p-1 md:text-lg"
      @click="isListOpen = !isListOpen"
    >
      <span class="w-4/5 text-center truncate px-1">{{ activeItemName || props.name }}</span>
      <div v-if="items && items.length > 0">
        <ArrowDown
          class="transition-transform duration-200 ease-out"
          :class="{ 'rotate-180': isListOpen }"
        />
      </div>
    </div>

    <!-- 下拉菜单 -->
    <div class="relative">
      <Transition name="slide-down">
        <div v-if="isListOpen" class="visible absolute top-2 z-50 w-[calc(100vw-2rem)] md:w-100">
          <div class="my-backdrop-blur-lg">
            <div
              v-for="item of items"
              class="text-md text-primary-100 hover:bg-primary-300/30 flex items-center justify-between px-3 py-2 hover:text-white md:px-5"
              :class="activeItemName === item.name ? 'bg-primary-300/50 text-white' : ''"
              :key="item.name"
              :title="item.name"
              @click="setActiveItem(item)"
            >
              {{ item.name }}
              <!-- <ArrowDown class="text-2xl ml-1" v-if="item.subitems" /> -->
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowDown from '@/components/icons/ArrowDown.vue'
import { onMounted, onBeforeUnmount, ref } from 'vue'

// 定义FilterItemType接口
export interface FilterItemType {
  name: string
  value: string | number | undefined
  // subitems?: NavItemType[] // 如果需要支持子项目，可以添加
}

const isListOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const activeItemName = ref('')
const activeItemValue = ref<string | number | undefined>('')

const setActiveItem = (item: FilterItemType) => {
  activeItemName.value = item.name
  activeItemValue.value = item.value
  isListOpen.value = false // 选择后关闭下拉菜单
}

const props = defineProps<{
  name: string
  items?: FilterItemType[]
}>()

const reset = () => {
  if (props.items && props.items.length > 0) {
    activeItemName.value = '' // 重置为空，显示 props.name
    activeItemValue.value = props.items[0].value
  }
}

defineExpose({
  activeItemName,
  activeItemValue,
  reset,
})

const onBodyClick = (e: MouseEvent) => {
  const target = e.target as Node
  if (isListOpen.value && rootEl.value && !rootEl.value.contains(target)) {
    isListOpen.value = false
  }
}

onMounted(() => {
  if (props.items && props.items.length > 0) {
    // 默认选中第一个（通常是“全部”），但按钮上初始显示 props.name（如“时代”），直到用户主动选择
    // 或者如果你想默认显示第一个选项的名字，可以取消注释下面这行：
    // activeItemName.value = props.items[0].name
    activeItemValue.value = props.items[0].value
  }
  document.addEventListener('click', onBodyClick, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onBodyClick, true)
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.18s cubic-bezier(0.2, 0, 0, 1), opacity 0.18s cubic-bezier(0.2, 0, 0, 1);
  will-change: transform, opacity;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.98);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}
</style>
