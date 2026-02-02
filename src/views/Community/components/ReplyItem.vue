<template>
  <div class="group">
    <!-- 评论主体 -->
    <div class="flex gap-4 mb-4">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <div class="relative w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary font-bold text-sm ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all">
          {{ (reply.userName || `用户${reply.userId}`).charAt(0) }}
        </div>
      </div>
      
      <!-- 内容 -->
      <div class="flex-1">
        <div class="bg-gray-50 rounded-[1.25rem] px-5 py-4 border border-gray-100 hover:border-gray-200 transition-colors inline-block min-w-[240px] max-w-full relative">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="font-bold text-gray-900 text-sm tracking-wide">
              {{ reply.userName || `用户${reply.userId}` }}
            </span>
            <span v-if="reply.targetUserName" class="text-gray-400 text-xs flex items-center gap-1 font-medium">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              {{ reply.targetUserName }}
            </span>
          </div>
          
          <div class="text-gray-800 text-base leading-relaxed whitespace-pre-wrap font-normal">
            {{ reply.content }}
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="flex items-center gap-4 mt-2 ml-4">
          <span class="text-xs text-gray-400 font-medium">{{ formatDate(reply.createdTime) }}</span>
          <button
            class="text-xs font-bold text-gray-500 hover:text-primary transition-colors tracking-wide"
            @click="showReplyForm = !showReplyForm"
          >
            {{ showReplyForm ? '取消' : '回复' }}
          </button>
        </div>

        <!-- 评论图片 -->
        <div v-if="reply.images && reply.images.length > 0" class="mt-3 ml-2 flex gap-2 flex-wrap">
          <div
            v-for="(img, index) in reply.images"
            :key="index"
            class="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in hover:border-primary/30 transition-all"
            @click="previewImage(img)"
          >
            <img
              :src="img"
              alt="评论图片"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <!-- 回复表单 -->
        <div v-if="showReplyForm" class="mt-4 ml-2 animate-in slide-in-from-top-2 duration-200">
          <ReplyForm
            :post-id="postId"
            :answer-id="reply.id"
            :target-user-id="reply.userId"
            :target-reply-id="reply.id"
            @reply-success="handleReplySuccess"
          />
        </div>

        <!-- 子评论 -->
        <div v-if="reply.children && reply.children.length > 0" class="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
          <ReplyItem
            v-for="child in reply.children"
            :key="child.id"
            :reply="child"
            :post-id="postId"
            @reply-success="$emit('replySuccess')"
          />
        </div>
      </div>
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
