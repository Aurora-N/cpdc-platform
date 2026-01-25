<template>
  <div class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <textarea
          v-model="content"
          rows="3"
          maxlength="255"
          placeholder="写下你的评论..."
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all bg-white"
        ></textarea>
        <div class="text-sm text-gray-400 mt-2 text-right">{{ content.length }}/255</div>
      </div>
      <div class="flex flex-col justify-end">
        <button
          class="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium shadow-md hover:shadow-lg transition-all"
          :disabled="submitting || !content.trim()"
          @click="handleSubmit"
        >
          {{ submitting ? '提交中...' : '发表评论' }}
        </button>
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
