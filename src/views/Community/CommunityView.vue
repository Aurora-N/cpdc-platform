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
      <div class="relative py-10 md:py-12 mb-8">
        <!-- 多层背景装饰 -->
        <div class="absolute inset-0 -mx-4 md:-mx-8 rounded-3xl overflow-hidden">
          <!-- 渐变背景 -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary/8 via-white to-primary/5"></div>
          <!-- 装饰性图案 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <!-- 玻璃态效果 -->
          <div class="absolute inset-0 bg-white/95 backdrop-blur-md border border-primary/20 shadow-2xl"></div>
        </div>
        
        <div class="relative flex flex-col md:flex-row gap-5 px-6 md:px-10">
          <!-- 搜索栏 -->
          <div class="flex-1 relative group">
            <!-- 搜索栏背景光晕 -->
            <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative flex items-center bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 focus-within:border-primary/50 focus-within:shadow-[0_20px_60px_rgba(198,77,65,0.15)] focus-within:ring-4 focus-within:ring-primary/10 overflow-hidden">
              <!-- 左侧图标区域 -->
              <div class="pl-6 pr-4">
                <div class="relative">
                  <div class="w-12 h-12 bg-gradient-to-br from-primary-200 via-primary-300 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
                    <SearchIcon class="w-6 h-6 text-primary-700 relative z-10" />
                  </div>
                  <!-- 图标光点 -->
                  <div class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"></div>
                </div>
              </div>
              
              <!-- 输入框 -->
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索标题或内容..."
                class="flex-1 py-5 pr-4 focus:outline-none text-base bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                @keyup.enter="handleSearch"
              />
              
              <!-- 搜索按钮 -->
              <button
                class="mr-3 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-95 text-sm relative overflow-hidden group/btn"
                @click="handleSearch"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                <span class="relative">搜索</span>
              </button>
            </div>
          </div>

          <!-- 发帖按钮 -->
          <button
            class="relative px-10 py-5 bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white rounded-3xl hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 transition-all duration-500 font-bold whitespace-nowrap shadow-2xl hover:shadow-[0_25px_70px_rgba(198,77,65,0.4)] transform hover:-translate-y-1.5 active:translate-y-0 group overflow-hidden"
            @click="showPostModal = true"
          >
            <!-- 多层背景动画 -->
            <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- 装饰性光点 -->
            <div class="absolute top-2 right-4 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
            <div class="absolute bottom-3 left-6 w-1.5 h-1.5 bg-white/40 rounded-full blur-sm"></div>
            
            <span class="relative flex items-center gap-3 text-lg">
              <div class="w-8 h-8 bg-white/25 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner group-hover:bg-white/30 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span class="tracking-wide">发布帖子</span>
            </span>
          </button>
        </div>
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
