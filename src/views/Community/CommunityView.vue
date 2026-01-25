<template>
  <div class="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- 顶部占位区 -->
    <HeroComponent
      title="社区互动"
      background-url="/cpdc-platform/exhibition/5.png"
      title-color="white"
    />

    <!-- 主要内容区 -->
    <main class="max-w-[1600px] pb-12 px-4 md:px-8 lg:px-16 w-full">
      <!-- 搜索栏和发帖按钮 -->
      <div class="flex flex-col md:flex-row gap-4 py-8 md:py-10">
        <div class="flex-1 relative">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索标题或内容......"
            class="w-full px-5 py-3.5 pr-14 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base shadow-sm bg-white"
            @keyup.enter="handleSearch"
          />
          <div
            class="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-primary transition-colors"
            @click="handleSearch"
          >
            <SearchIcon class="w-5 h-5 text-gray-400 hover:text-primary" />
          </div>
        </div>
        <button
          class="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          @click="showPostModal = true"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            发帖
          </span>
        </button>
      </div>

      <!-- 帖子列表 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div class="text-gray-500 text-lg">加载中...</div>
        </div>
      </div>

      <div v-else-if="posts.length === 0" class="flex flex-col justify-center items-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="text-gray-500 text-lg">暂无帖子</div>
        <div class="text-gray-400 text-sm mt-2">快来发布第一条帖子吧！</div>
      </div>

      <div v-else class="space-y-6">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @like-changed="handleLikeChanged"
        />
      </div>

      <!-- 分页 -->
      <Pagination
        v-if="totalPages > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        @page-change="handlePageChange"
      />
    </main>

    <!-- 发帖弹窗 -->
    <PostModal v-if="showPostModal" @close="showPostModal = false" @success="handlePostSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import PostCard from './components/PostCard.vue'
import Pagination from './components/Pagination.vue'
import PostModal from './components/PostModal.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { getPostList } from '@/apis/postApi'
import type { Post, PageResult } from '@/types/post'

const posts = ref<Post[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const total = ref(0)
const searchKeyword = ref('')
const showPostModal = ref(false)

const pageSize = 5

// 获取帖子列表
const fetchPosts = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize,
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }
    const response = await getPostList(params)

    if (response.code === 200 && response.data) {
      const data = response.data as PageResult<Post>
      posts.value = data.records || []
      totalPages.value = data.pages || 0
      total.value = data.total || 0

      // 处理图片字段（如果是字符串，转换为数组）
      posts.value = posts.value.map((post) => {
        if (post.images && typeof post.images === 'string') {
          try {
            post.images = JSON.parse(post.images)
          } catch {
            post.images = post.images.split(',').filter(Boolean)
          }
        }
        return post
      })
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

// 处理点赞变化
const handleLikeChanged = (postId: number, liked: boolean, likedTimes: number) => {
  const post = posts.value.find((p) => p.id === postId)
  if (post) {
    post.isLiked = liked
    post.likedTimes = likedTimes
  }
}

// 处理发帖成功
const handlePostSuccess = () => {
  showPostModal.value = false
  currentPage.value = 1
  fetchPosts()
}

// 监听页码变化
watch(currentPage, () => {
  fetchPosts()
})

onMounted(() => {
  fetchPosts()
})
</script>
