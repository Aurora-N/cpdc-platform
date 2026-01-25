<template>
  <div class="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- 顶部占位区 -->
    <HeroComponent
      title="帖子详情"
      background-url="/cpdc-platform/exhibition/5.png"
      title-color="white"
    />

    <!-- 主要内容区 -->
    <main class="max-w-[1600px] pb-12 px-4 md:px-8 lg:px-16 w-full">
      <!-- 返回按钮 -->
      <button
        class="mt-8 mb-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-all font-medium"
        @click="goBack"
      >
        <ArrowLeft class="w-5 h-5" />
        <span>返回</span>
      </button>

      <!-- 加载中 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div class="text-gray-500 text-lg">加载中...</div>
        </div>
      </div>

      <!-- 帖子详情 -->
      <div v-else-if="post" class="bg-white rounded-2xl border border-gray-100 shadow-xl mb-8 overflow-hidden">
        <div class="p-8 md:p-10">
          <!-- 标题 -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{{ post.title }}</h1>

          <!-- 作者和发布时间 -->
          <div class="flex items-center gap-4 text-sm mb-6 pb-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                {{ (post.authorName || `用户${post.authorId}`).charAt((post.authorName || `用户${post.authorId}`).length - 1) }}
              </div>
              <div>
                <div class="font-semibold text-gray-800">{{ post.authorName || `用户${post.authorId}` }}</div>
                <div class="text-gray-400 text-xs">{{ formatDate(post.createdTime) }}</div>
              </div>
            </div>
          </div>

          <!-- 内容 -->
          <div class="text-gray-700 text-lg md:text-xl mb-8 leading-relaxed whitespace-pre-wrap">
            {{ post.content }}
          </div>

          <!-- 图片展示 -->
          <div v-if="post.images && post.images.length > 0" class="mb-8">
            <div
              v-if="post.images.length === 1"
              class="flex justify-start"
            >
              <img
                :src="post.images[0]"
                alt="帖子图片"
                class="max-w-full md:max-w-3xl h-auto rounded-2xl object-cover cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                @click="previewImage(post.images[0])"
              />
            </div>
            <div
              v-else-if="post.images.length === 2"
              class="grid grid-cols-2 gap-4"
            >
              <img
                v-for="(img, index) in post.images"
                :key="index"
                :src="img"
                alt="帖子图片"
                class="w-full h-72 md:h-96 object-cover rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                @click="previewImage(img)"
              />
            </div>
            <div
              v-else
              class="grid grid-cols-3 gap-3"
            >
              <img
                v-for="(img, index) in post.images.slice(0, 6)"
                :key="index"
                :src="img"
                alt="帖子图片"
                class="w-full h-56 md:h-72 object-cover rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                @click="previewImage(img)"
              />
            </div>
          </div>

          <!-- 交互数据 -->
          <div class="flex items-center gap-8 pt-6 border-t border-gray-100">
            <div class="flex items-center gap-2 text-gray-500">
              <EyeIcon class="w-5 h-5" />
              <span class="font-semibold">{{ post.watchTimes }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <CommentIcon class="w-5 h-5" />
              <span class="font-semibold">{{ post.replyCount }}</span>
            </div>
            <div
              class="flex items-center gap-2 cursor-pointer transition-all hover:scale-110"
              :class="post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
              @click="handleLike"
            >
              <HeartIcon :filled="post.isLiked" class="w-5 h-5 transition-transform" />
              <span class="font-semibold">{{ post.likedTimes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div class="p-8 md:p-10">
          <div class="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
              <CommentIcon class="w-5 h-5 text-primary-700" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900">评论 <span class="text-primary font-semibold">({{ replyCount }})</span></h2>
          </div>

          <!-- 发表评论 -->
          <ReplyForm
            :post-id="postId"
            @reply-success="handleReplySuccess"
          />

          <!-- 评论列表 -->
          <div v-if="repliesLoading" class="py-8 text-center text-gray-500">
            加载中...
          </div>

          <div v-else-if="replies.length === 0" class="py-8 text-center text-gray-500">
            暂无评论
          </div>

          <div v-else class="mt-6 space-y-4">
            <ReplyItem
              v-for="reply in replies"
              :key="reply.id"
              :reply="reply"
              :post-id="postId"
              @reply-success="handleReplySuccess"
            />
          </div>

          <!-- 评论分页 -->
          <Pagination
            v-if="replyTotalPages > 0"
            :current-page="replyCurrentPage"
            :total-pages="replyTotalPages"
            :total="replyTotal"
            @page-change="handleReplyPageChange"
            class="mt-6"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import ArrowLeft from '@/components/icons/ArrowLeft.vue'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import CommentIcon from '@/components/icons/CommentIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ReplyForm from './components/ReplyForm.vue'
import ReplyItem from './components/ReplyItem.vue'
import Pagination from './components/Pagination.vue'
import { getPostDetail, toggleLikePost, getReplyList } from '@/apis/postApi'
import type { Post, Reply, PageResult } from '@/types/post'

const route = useRoute()
const router = useRouter()

const postId = computed(() => Number(route.params.id))
const post = ref<Post | null>(null)
const loading = ref(false)
const replies = ref<Reply[]>([])
const repliesLoading = ref(false)
const replyCurrentPage = ref(1)
const replyTotalPages = ref(0)
const replyTotal = ref(0)
const replyPageSize = 10

const replyCount = computed(() => post.value?.replyCount || 0)

// 获取帖子详情
const fetchPostDetail = async () => {
  loading.value = true
  try {
    const response = await getPostDetail(postId.value)
    if (response.code === 200 && response.data) {
      post.value = response.data

      // 处理图片字段
      if (post.value.images && typeof post.value.images === 'string') {
        try {
          post.value.images = JSON.parse(post.value.images)
        } catch {
          post.value.images = post.value.images.split(',').filter(Boolean)
        }
      }
    }
  } catch (error) {
    console.error('获取帖子详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取评论列表
const fetchReplies = async () => {
  repliesLoading.value = true
  try {
    const response = await getReplyList(postId.value, {
      page: replyCurrentPage.value,
      size: replyPageSize,
    })

    if (response.code === 200 && response.data) {
      const data = response.data as PageResult<Reply>
      replies.value = data.records || []
      replyTotalPages.value = data.pages || 0
      replyTotal.value = data.total || 0

      // 处理图片字段
      replies.value = replies.value.map((reply) => {
        if (reply.images && typeof reply.images === 'string') {
          try {
            reply.images = JSON.parse(reply.images)
          } catch {
            reply.images = reply.images.split(',').filter(Boolean)
          }
        }
        return reply
      })

      // 构建评论树形结构
      buildReplyTree()
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
  } finally {
    repliesLoading.value = false
  }
}

// 构建评论树形结构
const buildReplyTree = () => {
  const replyMap = new Map<number, Reply>()
  const rootReplies: Reply[] = []

  // 先创建所有评论的映射
  replies.value.forEach((reply) => {
    reply.children = []
    replyMap.set(reply.id, reply)
  })

  // 构建树形结构
  replies.value.forEach((reply) => {
    if (reply.answerId === 0) {
      // 顶级评论
      rootReplies.push(reply)
    } else {
      // 子评论
      const parent = replyMap.get(reply.answerId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(reply)
      }
    }
  })

  replies.value = rootReplies
}

// 处理点赞
const handleLike = async () => {
  if (!post.value) return

  try {
    const response = await toggleLikePost(postId.value)
    if (response.code === 200 && post.value) {
      post.value.isLiked = response.data.liked
      post.value.likedTimes = response.data.likedTimes
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 处理评论成功
const handleReplySuccess = () => {
  replyCurrentPage.value = 1
  fetchReplies()
  if (post.value) {
    post.value.replyCount += 1
  }
}

// 处理评论分页变化
const handleReplyPageChange = (page: number) => {
  replyCurrentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 预览图片
const previewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
}

// 返回
const goBack = () => {
  router.back()
}

// 监听评论页码变化
watch(replyCurrentPage, () => {
  fetchReplies()
})

onMounted(() => {
  fetchPostDetail()
  fetchReplies()
})
</script>
