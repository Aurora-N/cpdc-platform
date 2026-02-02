<template>
  <div class="mb-2">
    <div class="relative group">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
      <div class="relative">
        <textarea
          v-model="content"
          rows="3"
          maxlength="255"
          placeholder="分享你的见解..."
          class="w-full px-5 py-4 bg-white border border-gray-200 focus:border-primary focus:ring-0 rounded-2xl text-base text-gray-900 placeholder-gray-400 resize-none transition-all duration-200"
        ></textarea>
        
        <div class="flex items-center justify-between mt-3 px-1">
          <div class="text-xs text-gray-400 font-medium">{{ content.length }}/255</div>
          <button
            class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-bold text-sm shadow-lg shadow-primary/30 transition-all active:scale-95 tracking-wide"
            :disabled="submitting || !content.trim()"
            @click="handleSubmit"
          >
            {{ submitting ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createReply } from '@/apis/postApi'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
  postId: number
  answerId?: number // 回复的评论ID，不传或0表示回复帖子
  targetUserId?: number // 目标用户ID
  targetReplyId?: number // 目标评论ID
}>()

const emit = defineEmits<{
  replySuccess: []
}>()

const userStore = useUserStore()
const content = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  if (!content.value.trim()) {
    return
  }

  submitting.value = true
  try {
    const response = await createReply(props.postId, {
      content: content.value.trim(),
      answerId: props.answerId || 0,
      targetUserId: props.targetUserId,
      targetReplyId: props.targetReplyId,
    })

    if (response.code === 200) {
      content.value = ''
      emit('replySuccess')
    }
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表评论失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>
