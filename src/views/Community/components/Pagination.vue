<template>
  <div class="flex flex-col md:flex-row justify-center items-center gap-4 my-10">
    <div class="flex items-center gap-2">
      <button
        class="px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <span class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          上一页
        </span>
      </button>

      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="w-10 h-10 rounded-xl border-2 transition-all font-medium shadow-sm"
          :class="
            page === currentPage
              ? 'bg-gradient-to-r from-primary to-primary-600 text-white border-primary shadow-md scale-110'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-primary/30 hover:shadow-md'
          "
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <span class="flex items-center gap-1">
          下一页
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>

    <span class="text-gray-500 text-sm font-medium">
      共 <span class="text-primary font-semibold">{{ total }}</span> 条，第 <span class="text-primary font-semibold">{{ currentPage }}</span> / <span class="text-primary font-semibold">{{ totalPages }}</span> 页
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  total: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

// 计算可见的页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>
