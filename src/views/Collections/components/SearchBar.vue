<template>
  <div class="flex flex-col">
    <div
      class="border-primary bg-primary/70 flex w-[8rem] items-center justify-center border-2 text-lg text-white duration-200 ease-in-out focus-within:w-[16rem]"
    >
      <input
        type="text"
        placeholder="搜索"
        class="w-[calc(100%-2rem)] flex-1 px-2 outline-0"
        v-model="serachContent"
        @input="onInput"
        @keyup.enter="handleSerach"
      />
      <div
        class="bg-primary hover:bg-primary-600 flex h-[2rem] w-[2rem] cursor-pointer items-center justify-center"
        @click="handleSerach"
      >
        <SearchIcon />
      </div>
    </div>
    <!-- 搜索建议下拉框 -->
    <div class="relative">
      <Transition name="slide-down">
        <div
          v-if="suggestions.length > 0 && serachContent"
          class="visible absolute top-2 z-50 w-[16rem]"
        >
          <div class="my-backdrop-blur-lg">
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="text-md text-primary-100 hover:bg-primary-300/30 flex items-center justify-between px-3 py-2 hover:text-white md:px-5"
              @click="selectSuggestion(suggestion)"
            >
              <span v-html="suggestion"></span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { ref } from 'vue'
import { debounce } from '@/utils/utils'
import { getSearchSuggestion } from '@/apis/exhibitionApi'

const serachContent = ref('')
const suggestions = ref<string[]>([])

const emits = defineEmits(['search-clicked'])

const getSearchSuggestions = debounce(async (value: string) => {
  if (value.trim() === '') {
    suggestions.value = []
    return
  }
  try {
    const res = await getSearchSuggestion(value)
    suggestions.value = res.data
  } catch (error) {
    console.error('获取搜索建议失败:', error)
    suggestions.value = []
  }
}, 1000)

const onInput = () => {
  getSearchSuggestions(serachContent.value)
}

const handleSerach = async () => {
  suggestions.value = [] // 清空建议
  emits('search-clicked') // 触发搜索事件
}

const selectSuggestion = (suggestion: string) => {
  const cleanSuggestion = suggestion.replace(/<.?em>/g, '') // 移除<em>和</em>标签
  serachContent.value = cleanSuggestion
  suggestions.value = [] // 清空建议
  emits('search-clicked') // 触发搜索事件
}

defineExpose({
  serachContent,
})
</script>

<style scoped>
/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

<style>
em {
  color: white;
  font-style: normal;
  font-weight: bold;
  padding: 0 2px;
}
</style>
