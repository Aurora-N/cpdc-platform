<template>
  <div class="border-l-4 border-primary/20 pl-5 py-4 bg-gray-50/50 rounded-r-lg mb-4 hover:bg-gray-50 transition-colors">
    <!-- 评论主体 -->
    <div class="mb-3">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center text-primary-700 font-semibold text-xs">
          {{ (reply.userName || `用户${reply.userId}`).charAt((reply.userName || `用户${reply.userId}`).length - 1) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-800">
              {{ reply.userName || `用户${reply.userId}` }}
            </span>
            <span v-if="reply.targetUserName" class="text-gray-500 text-sm">
              回复
              <span class="text-primary font-medium">{{ reply.targetUserName }}</span>
            </span>
          </div>
          <div class="text-gray-400 text-xs mt-0.5">
            {{ formatDate(reply.createdTime) }}
          </div>
        </div>
      </div>
      <div class="text-gray-700 leading-relaxed whitespace-pre-wrap ml-11">
        {{ reply.content }}
      </div>
      <!-- 评论图片 -->
      <div v-if="reply.images && reply.images.length > 0" class="mt-3 ml-11 flex gap-2 flex-wrap">
        <img
          v-for="(img, index) in reply.images"
          :key="index"
          :src="img"
          alt="评论图片"
          class="w-28 h-28 object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all hover:scale-105"
          @click="previewImage(img)"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-4 text-sm ml-11">
      <button
        class="px-3 py-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
        @click="showReplyForm = !showReplyForm"
      >
        {{ showReplyForm ? '取消回复' : '回复' }}
      </button>
    </div>

    <!-- 回复表单 -->
    <div v-if="showReplyForm" class="mt-4">
      <ReplyForm
        :post-id="postId"
        :answer-id="reply.id"
        :target-user-id="reply.userId"
        :target-reply-id="reply.id"
        @reply-success="handleReplySuccess"
      />
    </div>

    <!-- 子评论 -->
    <div v-if="reply.children && reply.children.length > 0" class="mt-4 space-y-3">
      <ReplyItem
        v-for="child in reply.children"
        :key="child.id"
        :reply="child"
        :post-id="postId"
        @reply-success="$emit('replySuccess')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Reply } from '@/types/post'
import ReplyForm from './ReplyForm.vue'

const props = defineProps<{
  reply: Reply
  postId: number
}>()

const emit = defineEmits<{
  replySuccess: []
}>()

const showReplyForm = ref(false)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

// 预览图片
const previewImage = (imageUrl: string) => {
  window.open(imageUrl, '_blank')
}

// 处理回复成功
const handleReplySuccess = () => {
  showReplyForm.value = false
  emit('replySuccess')
}
</script>
