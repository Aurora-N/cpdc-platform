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
        <div v-if="images && images.length > 0" class="mt-3 ml-2 flex gap-2 flex-wrap">
          <div
            v-for="(img, index) in images"
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

        <!-- 子评论区域 -->
        <div v-if="childTotal > 0" class="mt-3 ml-2">
          <!-- 展开/收起按钮 -->
          <button
            v-if="!isExpanded"
            class="text-xs font-bold text-primary hover:text-primary-600 flex items-center gap-1 transition-colors"
            @click="toggleExpand"
          >
            <span class="w-4 h-0.5 bg-primary/30 rounded-full mr-1"></span>
            查看 {{ childTotal }} 条回复
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- 展开后的子评论列表 -->
          <div v-if="isExpanded" class="pl-4 border-l-2 border-gray-100 space-y-4 mt-4">
            <!-- 注意：这里不再递归调用 ReplyItem，而是直接渲染子评论内容，避免无限嵌套 -->
            <div 
              v-for="child in childReplies" 
              :key="child.id"
              class="group/child"
            >
              <div class="flex gap-3">
                <!-- 子评论头像 -->
                <div class="flex-shrink-0">
                  <div class="relative w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-primary font-bold text-xs ring-1 ring-gray-100 group-hover/child:ring-primary/20 transition-all">
                    {{ (child.userName || `用户${child.userId}`).charAt(0) }}
                  </div>
                </div>

                <!-- 子评论内容 -->
                <div class="flex-1">
                  <div class="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 hover:border-gray-200 transition-colors inline-block min-w-[200px] max-w-full relative">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-bold text-gray-900 text-xs tracking-wide">
                        {{ child.userName || `用户${child.userId}` }}
                      </span>
                      <!-- 显示回复对象：当 targetUserName 存在时显示 -->
                      <span v-if="child.targetUserName" class="text-gray-400 text-xs flex items-center gap-1 font-medium">
                        <span class="text-gray-300">回复</span>
                        <span class="text-primary/80">@{{ child.targetUserName }}</span>
                      </span>
                    </div>
                    
                    <div class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {{ child.content }}
                    </div>
                  </div>

                  <!-- 子评论底部操作栏 -->
                  <div class="flex items-center gap-4 mt-1.5 ml-2">
                    <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(child.createdTime) }}</span>
                    <button
                      class="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors tracking-wide"
                      @click="openChildReplyForm(child)"
                    >
                      回复
                    </button>
                  </div>

                  <!-- 子评论图片 -->
                  <div v-if="child.images && child.images.length > 0" class="mt-2 ml-1 flex gap-2 flex-wrap">
                    <div
                      v-for="(img, index) in child.images"
                      :key="index"
                      class="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in hover:border-primary/30 transition-all"
                      @click="previewImage(img)"
                    >
                      <img
                        :src="img"
                        alt="评论图片"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <!-- 子评论的回复表单 -->
                  <div v-if="activeChildReplyId === child.id" class="mt-3 ml-1 animate-in slide-in-from-top-2 duration-200">
                    <ReplyForm
                      :post-id="postId"
                      :answer-id="reply.id" 
                      :target-user-id="child.userId"
                      :target-reply-id="child.id"
                      @reply-success="handleChildReplySuccess"
                      @cancel="activeChildReplyId = null"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多子评论按钮 -->
            <div class="pt-2">
              <button
                v-if="childReplies.length < childTotal"
                class="text-xs font-bold text-primary hover:text-primary-600 flex items-center gap-1 transition-colors"
                @click="loadMoreChildren"
                :disabled="childLoading"
              >
                <span v-if="childLoading" class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-1"></span>
                {{ childLoading ? '加载中...' : `查看更多回复 (${childTotal - childReplies.length})` }}
              </button>
              
              <button
                class="text-xs text-gray-400 hover:text-gray-600 mt-2 block"
                @click="toggleExpand"
              >
                收起回复
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <ImagePreview
      v-model:visible="previewVisible"
      :image-url="previewImageUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Reply } from '@/types/post'
import ReplyForm from './ReplyForm.vue'
import { parseImages, formatDate } from '@/utils/formatUtils'
import ImagePreview from '@/components/ImagePreview.vue'
import { getReplyList } from '@/apis/postApi'

const props = defineProps<{
  reply: Reply
  postId: number
}>()

const emit = defineEmits<{
  replySuccess: [refreshList?: boolean]
}>()

const showReplyForm = ref(false)
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 子评论相关状态
const childReplies = ref<Reply[]>([])
const childTotal = ref(0)
const childPage = ref(1)
const childLoading = ref(false)
const isExpanded = ref(false)
const childPageSize = 5
const activeChildReplyId = ref<number | null>(null)

// 解析图片
const images = parseImages(props.reply.images as unknown as string)

// 预览图片
const previewImage = (imageUrl: string) => {
  previewImageUrl.value = imageUrl
  previewVisible.value = true
}

// 处理回复成功
const handleReplySuccess = () => {
  showReplyForm.value = false
  // 传递 false，告诉父组件不要刷新一级列表
  emit('replySuccess', false)
  
  // 如果之前没有子评论，现在有了，需要更新状态
  if (childTotal.value === 0) {
    childTotal.value = 1
    // 自动展开并加载
    if (!isExpanded.value) {
      isExpanded.value = true
      fetchChildReplies()
    }
  } else {
    // 如果已经展开，刷新列表
    if (isExpanded.value) {
      childPage.value = 1
      childReplies.value = []
      fetchChildReplies()
      // 更新总数（简单的 +1，虽然不严谨但能即时反馈）
      childTotal.value++
    } else {
      // 如果没展开，只更新总数，让用户看到变化
      childTotal.value++
    }
  }
}

// 打开子评论回复表单
const openChildReplyForm = (child: Reply) => {
  if (activeChildReplyId.value === child.id) {
    activeChildReplyId.value = null
  } else {
    activeChildReplyId.value = child.id
  }
}

// 处理子评论回复成功
const handleChildReplySuccess = () => {
  activeChildReplyId.value = null
  // 传递 false，告诉父组件不要刷新一级列表
  emit('replySuccess', false)
  // 刷新子评论
  childPage.value = 1
  childReplies.value = []
  fetchChildReplies()
  // 更新总数
  childTotal.value++
}

// 获取子评论
const fetchChildReplies = async () => {
  if (childLoading.value) return
  
  childLoading.value = true
  try {
    const response = await getReplyList({
      postId: props.postId,
      answerId: props.reply.id,
      page: childPage.value,
      size: childPageSize,
    })

    if (response.code === 200 && response.data) {
      const data = response.data
      const newReplies = data.records || []
      
      // 处理图片
      newReplies.forEach(reply => {
        reply.images = parseImages(reply.images as unknown as string)
      })

      if (childPage.value === 1) {
        childReplies.value = newReplies
      } else {
        childReplies.value = [...childReplies.value, ...newReplies]
      }
      
      childTotal.value = data.total || 0
    }
  } catch (error) {
    console.error('获取子评论失败:', error)
  } finally {
    childLoading.value = false
  }
}

// 检查是否有子评论（预加载总数）
const checkHasChildren = async () => {
  try {
    const response = await getReplyList({
      postId: props.postId,
      answerId: props.reply.id,
      page: 1,
      size: 1, // 只取1条来获取总数
    })
    if (response.code === 200 && response.data) {
      childTotal.value = response.data.total || 0
    }
  } catch (error) {
    console.error('检查子评论失败:', error)
  }
}

// 展开/收起子评论
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value && childReplies.value.length === 0) {
    fetchChildReplies()
  }
}

// 加载更多子评论
const loadMoreChildren = () => {
  childPage.value++
  fetchChildReplies()
}

onMounted(() => {
  // 检查是否有子评论
  checkHasChildren()
})
</script>
