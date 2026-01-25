<template>
  <div
    class="w-full bg-white rounded-2xl border border-gray-100 hover:border-primary/30 duration-300 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    @click="goToDetail"
  >
    <div class="p-6 md:p-8">
      <!-- 标题 -->
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
        {{ post.title }}
      </h2>

      <!-- 作者和发布时间 -->
      <div class="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-primary-700 font-semibold text-xs">
            {{ (post.authorName || `用户${post.authorId}`).charAt((post.authorName || `用户${post.authorId}`).length - 1) }}
          </div>
          <span class="font-medium text-gray-700">{{ post.authorName || `用户${post.authorId}` }}</span>
        </div>
        <span class="text-gray-400">·</span>
        <span class="text-gray-500">{{ formatDate(post.createdTime) }}</span>
      </div>

      <!-- 内容 -->
      <div class="text-gray-700 text-base md:text-lg mb-5 leading-relaxed line-clamp-3">
        {{ post.content }}
      </div>

      <!-- 图片展示 -->
      <div v-if="post.images && post.images.length > 0" class="mb-5">
        <div
          v-if="post.images.length === 1"
          class="flex justify-start"
        >
          <img
            :src="post.images[0]"
            alt="帖子图片"
            class="max-w-full md:max-w-lg h-auto rounded-xl object-cover shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click.stop="previewImage(post.images[0])"
          />
        </div>
        <div
          v-else-if="post.images.length === 2"
          class="grid grid-cols-2 gap-3"
        >
          <img
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            alt="帖子图片"
            class="w-full h-52 md:h-64 object-cover rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            @click.stop="previewImage(img)"
          />
        </div>
        <div
          v-else
          class="grid grid-cols-3 gap-2"
        >
          <img
            v-for="(img, index) in post.images.slice(0, 6)"
            :key="index"
            :src="img"
            alt="帖子图片"
            class="w-full h-36 md:h-48 object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            @click.stop="previewImage(img)"
          />
        </div>
      </div>

      <!-- 交互数据 -->
      <div class="flex items-center gap-6 pt-4 border-t border-gray-100">
        <div class="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
          <EyeIcon class="w-5 h-5" />
          <span class="font-medium">{{ post.watchTimes }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
          <CommentIcon class="w-5 h-5" />
          <span class="font-medium">{{ post.replyCount }}</span>
        </div>
        <div
          class="flex items-center gap-2 cursor-pointer transition-all hover:scale-110"
          :class="post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'"
          @click.stop="handleLike"
        >
          <HeartIcon :filled="post.isLiked" class="w-5 h-5 transition-transform" />
          <span class="font-medium">{{ post.likedTimes }}</span>
        </div>
      </div>
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
  // 可以在这里实现图片预览功能
  window.open(imageUrl, '_blank')
}
</script>
