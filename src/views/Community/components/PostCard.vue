<template>
  <div
    class="group relative bg-white rounded-2xl p-6 sm:p-8 transition-all duration-300 border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    @click="goToDetail"
  >
    <!-- 顶部作者信息 -->
    <div class="relative flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary font-bold text-sm ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all">
          {{ (post.authorName || `用户${post.authorId}`).charAt((post.authorName || `用户${post.authorId}`).length - 1) }}
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-gray-900 text-sm tracking-wide group-hover:text-primary transition-colors">{{ post.authorName || `用户${post.authorId}` }}</span>
          <span class="text-gray-400 text-xs">{{ formatDate(post.createdTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 标题和内容 -->
    <div class="relative mb-5">
      <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight tracking-wide">
        {{ post.title }}
      </h2>
      <p class="text-gray-600 text-base leading-relaxed line-clamp-3 font-medium">
        {{ post.content }}
      </p>
    </div>

    <!-- 图片网格 -->
    <div v-if="post.images && post.images.length > 0" class="relative mb-6">
      <div
        class="grid gap-2"
        :class="getImageGridClass(post.images.length)"
      >
        <div
          v-for="(img, index) in post.images.slice(0, 3)"
          :key="index"
          class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group/img"
          @click.stop="previewImage(img)"
        >
          <img
            :src="img"
            alt="帖子图片"
            class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
          />
          <div v-if="index === 2 && post.images.length > 3" class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg backdrop-blur-[2px]">
            +{{ post.images.length - 3 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 底部交互栏 -->
    <div class="relative flex items-center gap-2 pt-5 border-t border-gray-50">
      <!-- 浏览数 -->
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium border border-gray-100 cursor-default">
        <EyeIcon class="w-4 h-4" />
        <span>{{ post.watchTimes }} 浏览</span>
      </div>
      
      <!-- 评论数 -->
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-medium border border-gray-100 cursor-default">
        <CommentIcon class="w-4 h-4" />
        <span>{{ post.replyCount }} 回复</span>
      </div>

      <!-- 点赞按钮 (右侧) -->
      <button
        class="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300 border group/like"
        :class="post.isLiked 
          ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-700'"
        @click.stop="handleLike"
      >
        <HeartIcon :filled="post.isLiked" class="w-4 h-4 transition-transform group-hover/like:scale-110" />
        <span class="text-xs font-bold">{{ post.likedTimes }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Post } from '@/types/post'
import { toggleLikePost } from '@/apis/postApi'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import CommentIcon from '@/components/icons/CommentIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  likeChanged: [postId: number, liked: boolean, likedTimes: number]
}>()

const router = useRouter()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取图片网格样式
const getImageGridClass = (count: number) => {
  if (count === 1) return 'grid-cols-1 max-w-sm'
  if (count === 2) return 'grid-cols-2'
  return 'grid-cols-3'
}

// 跳转到详情页
const goToDetail = () => {
  router.push(`/community/${props.post.id}`)
}

// 处理点赞
const handleLike = async () => {
  try {
    const response = await toggleLikePost(props.post.id)
    if (response.code === 200) {
      emit('likeChanged', props.post.id, response.data.liked, response.data.likedTimes)
    }
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 预览图片
const previewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
}
</script>
