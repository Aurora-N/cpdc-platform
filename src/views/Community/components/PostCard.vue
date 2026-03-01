<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '@/types/post'
import { toggleLikePost } from '@/apis/postApi'
import { parseImages, formatDate } from '@/utils/formatUtils'
import { useUserStore } from '@/stores/userStore'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import CommentIcon from '@/components/icons/CommentIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'
import ImagePreview from '@/components/ImagePreview.vue'

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  likeChanged: [postId: number, liked: boolean, likedTimes: number]
}>()

const router = useRouter()
const userStore = useUserStore()

// 图片预览
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 解析图片
const images = parseImages(props.post.images as unknown as string)

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

// 处理点赞 (乐观更新)
const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  // 记录原始状态用于回滚
  const originalLiked = !!props.post.isLiked
  const originalLikedTimes = props.post.likedTimes

  // 乐观更新
  const newLiked = !originalLiked
  const newLikedTimes = originalLiked ? originalLikedTimes - 1 : originalLikedTimes + 1
  
  // 立即通知父组件更新 UI
  emit('likeChanged', props.post.id, newLiked, newLikedTimes)

  try {
    const response = await toggleLikePost(props.post.id)
    // 后端返回成功，不需要做额外操作，因为UI已经更新了
    // 只有当 code !== 200 时才视为业务失败
    if (response.code !== 200) {
      throw new Error(response.message || '点赞失败')
    }
  } catch (error: any) {
    console.error('点赞失败:', error)
    // 发生错误，回滚状态
    emit('likeChanged', props.post.id, originalLiked, originalLikedTimes)
    alert(error.message || '操作失败，请重试')
  }
}

// 预览图片
const previewImage = (imageUrl: string) => {
  previewImageUrl.value = imageUrl
  previewVisible.value = true
}
</script>

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
    <div v-if="images && images.length > 0" class="relative mb-6">
      <div
        class="grid gap-2"
        :class="getImageGridClass(images.length)"
      >
        <div
          v-for="(img, index) in images.slice(0, 3)"
          :key="index"
          class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group/img"
          @click.stop="previewImage(img)"
        >
          <img
            :src="img"
            alt="帖子图片"
            class="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
          />
          <div v-if="index === 2 && images.length > 3" class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg backdrop-blur-[2px]">
            +{{ images.length - 3 }}
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

    <!-- 图片预览 -->
    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImageUrl"
    />
  </div>
</template>

