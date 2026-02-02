<template>
  <div class="min-h-screen bg-gray-50 relative overflow-hidden text-gray-900 font-sans">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
    </div>

    <!-- 顶部占位区 -->
    <HeroComponent
      title="社区互动"
      background-url="/cpdc-platform/exhibition/5.png"
      title-color="white"
      class="relative z-10 shadow-sm"
    />

    <!-- 主要内容区 -->
    <main class="max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 w-full relative z-10">
      <!-- 搜索栏和发帖按钮 (居中悬浮胶囊设计) -->
      <div class="max-w-4xl mx-auto -mt-8 mb-12 relative z-20">
        <div class="bg-white rounded-full p-2 shadow-xl shadow-gray-200/50 flex items-center gap-2 border border-gray-100">
          <!-- 搜索图标 -->
          <div class="pl-4 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </div>
          
          <!-- 输入框 -->
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索感兴趣的话题..."
            class="flex-1 py-3 px-2 bg-transparent border-none text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-base"
            @keyup.enter="handleSearch"
          />

          <!-- 清除按钮 -->
            <button
              v-if="searchKeyword"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors mr-1"
              @click="clearSearch"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          <!-- 搜索按钮 -->
          <button
            class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all font-medium text-sm hidden sm:block"
            @click="handleSearch"
          >
            搜索
          </button>

          <!-- 分割线 -->
          <div class="w-px h-8 bg-gray-200 hidden sm:block"></div>

          <!-- 发帖按钮 -->
          <button
            class="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-600 text-white font-bold rounded-full transition-all shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 active:scale-95 whitespace-nowrap"
            @click="showPostModal = true"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>发布新帖</span>
          </button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div class="text-primary/80 font-medium text-sm animate-pulse">数据加载中...</div>
      </div>

      <div v-else-if="posts.length === 0" class="flex flex-col justify-center items-center py-32 bg-white/50 rounded-3xl border border-dashed border-gray-200 backdrop-blur-sm">
        <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-gray-100">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="text-gray-900 text-xl font-bold mb-2">暂无数据</div>
        <div class="text-gray-500 text-sm">还没有相关帖子，快来发布第一条吧</div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
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
import { ref, onMounted } from 'vue'
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import PostCard from './components/PostCard.vue'
import Pagination from './components/Pagination.vue'
import PostModal from './components/PostModal.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { getPostList } from '@/apis/postApi'
import type { Post, PageQueryDTO } from '@/types/post'
import { parseImages } from '@/utils/formatUtils'

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
    const params: PageQueryDTO = {
      page: currentPage.value,
      size: pageSize,
    }
    if (searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }
    const response = await getPostList(params)

    if (response.code === 200 && response.data) {
      const data = response.data
      posts.value = data.records || []
      totalPages.value = data.pages || 0
      total.value = data.total || 0

      // 处理图片字段（如果是字符串，转换为数组）
      posts.value = posts.value.map((post) => {
        post.images = parseImages(post.images as unknown as string)
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
  fetchPosts()
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  handleSearch()
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

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
/* 搜索栏输入框聚焦动画 */
input:focus {
  animation: inputFocus 0.3s ease-out;
}

@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}

/* 发帖按钮脉冲动画 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(198, 77, 65, 0.3);
  }
  50% {
    box-shadow: 0 20px 60px rgba(198, 77, 65, 0.5);
  }
}

button:hover {
  animation: pulse 2s ease-in-out infinite;
}
</style>
