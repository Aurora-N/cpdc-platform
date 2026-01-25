<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" @click.self="handleClose">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div class="p-8">
        <!-- 标题栏 -->
        <div class="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">发布帖子</h2>
          </div>
          <button
            class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            @click="handleClose"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit">
          <!-- 标题 -->
          <div class="mb-6">
            <label class="block text-gray-700 font-semibold mb-3 text-lg">标题 <span class="text-red-500">*</span></label>
            <input
              v-model="formData.title"
              type="text"
              maxlength="20"
              placeholder="请输入标题（最多20字）"
              class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
            <div class="text-sm text-gray-400 mt-2 text-right">{{ formData.title.length }}/20</div>
          </div>

          <!-- 内容 -->
          <div class="mb-6">
            <label class="block text-gray-700 font-semibold mb-3 text-lg">内容 <span class="text-red-500">*</span></label>
            <textarea
              v-model="formData.content"
              rows="6"
              maxlength="100"
              placeholder="请输入内容（最多100字）"
              class="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              required
            ></textarea>
            <div class="text-sm text-gray-400 mt-2 text-right">{{ formData.content.length }}/100</div>
          </div>

          <!-- 图片上传 -->
          <div class="mb-8">
            <label class="block text-gray-700 font-semibold mb-3 text-lg">图片（最多6张）</label>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="(image, index) in imageList"
                :key="index"
                class="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-primary transition-colors group"
              >
                <img
                  v-if="image"
                  :src="image"
                  alt="预览图"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  @click="triggerFileInput(index)"
                >
                  <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                    <svg class="w-6 h-6 text-gray-400 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="text-sm text-gray-500">添加图片</div>
                </div>
                <button
                  v-if="image"
                  type="button"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                  @click="removeImage(index)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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

          <!-- 按钮 -->
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              class="px-8 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              @click="handleClose"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-8 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
              :disabled="submitting"
            >
              {{ submitting ? '发布中...' : '发布' }}
            </button>
          </div>
        </form>
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
