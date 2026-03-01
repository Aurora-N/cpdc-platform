<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[150px]"></div>
    </div>

    <!-- 顶部占位区 -->
    <HeroComponent
      title="帖子详情"
      background-url="/cpdc-platform/exhibition/5.png"
      title-color="white"
      class="relative z-10 shadow-sm"
    />

    <!-- 主要内容区 -->
    <main class="max-w-6xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 w-full relative z-10 -mt-20">
      <!-- 导航栏 -->
      <div class="flex items-center justify-between mb-8">
        <button
          class="group flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white rounded-xl transition-all duration-300 font-medium border border-gray-100 hover:border-gray-200 backdrop-blur-md shadow-sm"
          @click="goBack"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span class="tracking-wide text-sm">返回列表</span>
        </button>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-4">
        <div class="relative w-12 h-12">
          <div class="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
          <div class="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div class="text-primary/80 font-medium text-sm animate-pulse">加载中...</div>
      </div>

      <!-- 帖子详情 -->
      <div v-else-if="post" class="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-xl mb-12 overflow-hidden relative group">
        <!-- 装饰线条 -->
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50"></div>
        
        <div class="p-8 md:p-12">
          <!-- 头部信息 -->
          <div class="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-primary font-bold text-lg ring-1 ring-gray-100">
                  {{ (post.authorName || `用户${post.authorId}`).charAt((post.authorName || `用户${post.authorId}`).length - 1) }}
                </div>
              </div>
              <div>
                <div class="font-bold text-gray-900 text-lg tracking-wide">{{ post.authorName || `用户${post.authorId}` }}</div>
                <div class="text-gray-400 text-xs mt-1 flex items-center gap-2">
                  <span>{{ formatDate(post.createdTime) }}</span>
                </div>
              </div>
            </div>
            
            <div class="hidden md:flex items-center gap-3">
              <button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 标题 -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-[1.2] tracking-wide">{{ post.title }}</h1>

          <!-- 内容 -->
          <div class="prose prose-lg max-w-none text-gray-800 leading-loose mb-12 whitespace-pre-wrap font-normal tracking-wide">
            {{ post.content }}
          </div>

          <!-- 图片展示 -->
          <div v-if="post.images && post.images.length > 0" class="mb-12">
            <div class="grid gap-4" :class="post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
              <div
                v-for="(img, index) in post.images"
                :key="index"
                class="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group/img cursor-zoom-in"
                :class="post.images.length === 1 ? 'max-h-[600px]' : 'aspect-[4/3]'"
                @click="previewImage(img)"
              >
                <img
                  :src="img"
                  alt="帖子图片"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  :class="post.images.length === 1 ? 'object-contain' : 'object-cover'"
                />
              </div>
            </div>
          </div>

          <!-- 交互数据 -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium">
                <EyeIcon class="w-4 h-4" />
                <span class="tracking-wide">{{ post.watchTimes }} 阅读</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium">
                <CommentIcon class="w-4 h-4" />
                <span class="tracking-wide">{{ post.replyCount }} 评论</span>
              </div>
            </div>

            <button
              class="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all duration-300 active:scale-95 group/like border"
              :class="post.isLiked 
                ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700'"
              @click="handleLike"
            >
              <HeartIcon :filled="post.isLiked" class="w-5 h-5 transition-transform group-hover/like:scale-110" />
              <span class="font-bold">{{ post.likedTimes }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-3">
            <span class="w-1.5 h-6 bg-primary rounded-full"></span>
            评论 <span class="text-gray-400 text-sm ml-2">共 {{ replyCount }} 条</span>
          </h2>
        </div>

        <!-- 发表评论 -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <ReplyForm
            :post-id="postId"
            @reply-success="handleReplySuccess"
          />
        </div>

        <!-- 评论列表 -->
        <div v-if="replies.length === 0 && !repliesLoading" class="py-20 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div class="text-gray-400 mb-2 text-lg">暂无评论</div>
          <div class="text-gray-400 text-sm">快来抢沙发吧</div>
        </div>

        <div v-else class="space-y-6">
          <ReplyItem
            v-for="reply in replies"
            :key="reply.id"
            :reply="reply"
            :post-id="postId"
            @reply-success="handleReplySuccess"
          />
        </div>

        <!-- 加载状态 -->
        <div v-if="repliesLoading" class="py-12 flex justify-center">
          <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        
        <div v-if="!hasMoreReplies && replies.length > 0" class="py-12 text-center text-gray-400 text-sm">
          - 到底啦 -
        </div>
      </div>
    </main>
    
    <!-- 图片预览 -->
    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImageUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import CommentIcon from '@/components/icons/CommentIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ReplyForm from './components/ReplyForm.vue'
import ReplyItem from './components/ReplyItem.vue'
import Pagination from '@/components/Pagination.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import { getPostDetail, toggleLikePost, getReplyList } from '@/apis/postApi'
import type { Post, Reply } from '@/types/post'
import { useUserStore } from '@/stores/userStore'
import { parseImages, formatDate } from '@/utils/formatUtils'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const postId = computed(() => Number(route.params.id))
const post = ref<Post | null>(null)
const loading = ref(false)

// 评论相关
const replies = ref<Reply[]>([])
const repliesLoading = ref(false)
const replyCurrentPage = ref(1)
const replyTotalPages = ref(0)
const replyTotal = ref(0)
const replyPageSize = 10
const hasMoreReplies = computed(() => replyCurrentPage.value < replyTotalPages.value)

const replyCount = computed(() => post.value?.replyCount || 0)

// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 获取帖子详情
const fetchPostDetail = async () => {
  loading.value = true
  try {
    const response = await getPostDetail(postId.value)
    if (response.code === 200 && response.data) {
      post.value = response.data

      // 处理图片字段
      post.value.images = parseImages(post.value.images as unknown as string)
    }
  } catch (error) {
    console.error('获取帖子详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取评论列表 (一级评论)
const fetchReplies = async (isLoadMore = false) => {
  if (repliesLoading.value) return
  
  repliesLoading.value = true
  try {
    const page = isLoadMore ? replyCurrentPage.value + 1 : 1
    
    // 获取一级评论
    const response = await getReplyList({
      postId: postId.value,
      answerId: 0,
      page: page,
      size: replyPageSize,
    })

    if (response.code === 200 && response.data) {
      const data = response.data
      let fetchedReplies = data.records || []
      replyTotalPages.value = data.pages || 0
      replyTotal.value = data.total || 0
      
      // 更新页码
      replyCurrentPage.value = page

      // 处理图片字段
      fetchedReplies = fetchedReplies.map((reply) => {
        reply.images = parseImages(reply.images as unknown as string)
        return reply
      })

      if (isLoadMore) {
        replies.value = [...replies.value, ...fetchedReplies]
      } else {
        replies.value = fetchedReplies
      }
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
  } finally {
    repliesLoading.value = false
  }
}

// 滚动监听 (无限加载)
const handleScroll = () => {
  if (repliesLoading.value || !hasMoreReplies.value) return
  
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  // 距离底部 100px 时加载更多
  if (scrollHeight - scrollTop - clientHeight < 100) {
    fetchReplies(true)
  }
}

// 处理点赞
const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  if (!post.value) return

  // 记录原始状态用于回滚
  const originalLiked = post.value.isLiked
  const originalLikedTimes = post.value.likedTimes

  // 乐观更新
  post.value.isLiked = !originalLiked
  post.value.likedTimes = originalLiked ? originalLikedTimes - 1 : originalLikedTimes + 1

  try {
    const response = await toggleLikePost(postId.value)
    if (response.code !== 200) {
      throw new Error(response.message || '点赞失败')
    }
  } catch (error: any) {
    console.error('点赞失败:', error)
    // 发生错误，回滚状态
    if (post.value) {
      post.value.isLiked = originalLiked
      post.value.likedTimes = originalLikedTimes
    }
    alert(error.message || '操作失败，请重试')
  }
}

// 处理评论成功
const handleReplySuccess = (refreshList = true) => {
  // 只有在发表一级评论，或者明确要求刷新时，才重载列表
  if (refreshList) {
    replyCurrentPage.value = 1
    fetchReplies(false)
  }
  
  // 无论如何都更新总评论数
  if (post.value) {
    post.value.replyCount += 1
  }
}

// 预览图片
const previewImage = (imageUrl: string) => {
  previewImageUrl.value = imageUrl
  previewVisible.value = true
}

// 返回
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchPostDetail()
  fetchReplies()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
