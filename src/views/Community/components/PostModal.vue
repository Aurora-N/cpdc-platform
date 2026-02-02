<template>
  <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300" @click.self="handleClose">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 relative">
      <!-- 标题栏 -->
      <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <h2 class="text-xl font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <span class="w-1.5 h-6 bg-primary rounded-full"></span>
          发布新帖
        </h2>
        <button
          class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          @click="handleClose"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-8 relative z-0">
        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 标题 -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">标题</label>
            <input
              v-model="formData.title"
              type="text"
              maxlength="30"
              placeholder="请输入引人注目的标题"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-lg font-medium text-gray-900 placeholder-gray-400 transition-all duration-200"
              required
            />
            <div class="text-xs text-gray-400 text-right">{{ formData.title.length }}/30</div>
          </div>

          <!-- 内容 -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">内容</label>
            <textarea
              v-model="formData.content"
              rows="6"
              maxlength="500"
              placeholder="分享你的想法..."
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-base text-gray-900 placeholder-gray-400 resize-none transition-all duration-200"
              required
            ></textarea>
            <div class="text-xs text-gray-400 text-right">{{ formData.content.length }}/500</div>
          </div>

          <!-- 图片上传 -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-gray-700">图片 <span class="text-gray-400 font-normal ml-2 text-xs">最多6张</span></label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in imageList"
                :key="index"
                class="relative aspect-square rounded-xl overflow-hidden group bg-gray-50 border border-gray-200 hover:border-primary/30 transition-colors"
              >
                <template v-if="image">
                  <img
                    :src="image"
                    alt="预览图"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors"></div>
                  <button
                    type="button"
                    class="absolute top-1.5 right-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 backdrop-blur-sm"
                    @click="removeImage(index)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </template>
                
                <div
                  v-else
                  class="w-full h-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors group/add"
                  @click="triggerFileInput(index)"
                >
                  <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm group-hover/add:border-primary group-hover/add:text-primary transition-all">
                    <svg class="w-4 h-4 text-gray-400 group-hover/add:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span class="text-xs text-gray-400 group-hover/add:text-primary transition-colors">添加</span>
                </div>

                <input
                  :ref="(el) => (fileInputs[index] = el as HTMLInputElement)"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload($event, index)"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- 底部按钮 -->
      <div class="px-8 py-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
        <button
          type="button"
          class="px-6 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-medium text-sm"
          @click="handleClose"
        >
          取消
        </button>
        <button
          type="button"
          class="px-8 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-lg shadow-primary/30 tracking-wide"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createPost, uploadImage } from '@/apis/postApi'
import { useUserStore } from '@/stores/userStore'

const emit = defineEmits<{
  close: []
  success: []
}>()

const userStore = useUserStore()

const formData = reactive({
  title: '',
  content: '',
})

const imageList = ref<(string | null)[]>(Array(6).fill(null))
const fileInputs = ref<(HTMLInputElement | null)[]>([])
const submitting = ref(false)

// 触发文件选择
const triggerFileInput = (index: number) => {
  const input = fileInputs.value[index]
  if (input) {
    input.click()
  }
}

// 处理图片上传
const handleImageUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 检查文件大小（例如限制5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过5MB')
    return
  }

  try {
    const response = await uploadImage(file)
    if (response.code === 200 && response.data) {
      imageList.value[index] = response.data
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    alert('图片上传失败，请重试')
  }

  // 清空input，允许重复选择同一文件
  target.value = ''
}

// 移除图片
const removeImage = (index: number) => {
  imageList.value[index] = null
}

// 提交表单
const handleSubmit = async () => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    return
  }

  submitting.value = true
  try {
    const images = imageList.value.filter((img) => img !== null) as string[]
    const response = await createPost({
      title: formData.title,
      content: formData.content,
      images: images.length > 0 ? images : undefined,
    })

    if (response.code === 200) {
      // 重置表单
      formData.title = ''
      formData.content = ''
      imageList.value = Array(6).fill(null)
      emit('success')
    }
  } catch (error) {
    console.error('发布失败:', error)
    alert('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}
</script>
