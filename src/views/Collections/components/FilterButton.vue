<template>
  <div class="flex flex-col">
    <div
      class="bg-primary text-md hover:bg-primary-600 flex w-[5rem] cursor-pointer items-center justify-center p-0.5 text-white select-none md:w-[8rem] md:p-1 md:text-lg"
      @click="isListOpen = !isListOpen"
    >
      <span class="w-4/5 text-center">{{ props.name }}</span>
      <div v-if="items && items.length > 0">
        <ArrowDown class="rotate-180" v-if="isListOpen" />
        <ArrowDown v-else />
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
import { onMounted, ref } from 'vue'

// 定义FilterItemType接口
export interface FilterItemType {
  name: string
  value: string | number | undefined
  // subitems?: NavItemType[] // 如果需要支持子项目，可以添加
}

const isListOpen = ref(false)

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

defineExpose({
  activeItemName,
  activeItemValue,
})

onMounted(() => {
  if (props.items && props.items.length > 0) {
    activeItemName.value = props.items[0].name
    activeItemValue.value = props.items[0].value
  }
})
</script>
