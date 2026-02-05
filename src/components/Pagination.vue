<template>
  <div class="flex flex-col md:flex-row justify-center items-center gap-6 my-12">
    <div class="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200"
          :class="
            page === currentPage
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          "
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <span class="text-gray-500 text-xs font-medium tracking-wide">
      共 {{ total }} 条
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
