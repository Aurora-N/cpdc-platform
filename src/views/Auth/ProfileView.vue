<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center py-12" style="background-image: url('/introbg.png')">
    <div class="my-backdrop-blur-lg rounded-lg shadow-2xl p-8 w-full max-w-2xl mx-4">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">个人信息</h1>
        <p class="text-primary-100">查看和管理您的账户信息</p>
      </div>

      <!-- 查看模式 -->
      <div v-if="!isEditMode" class="space-y-6">
        <!-- 用户名显示 -->
        <div class="bg-white/10 p-6 rounded-lg">
          <label class="block text-sm font-medium text-white mb-2">用户名</label>
          <p class="text-xl text-white">{{ displayUserName }}</p>
        </div>

        <!-- 密码显示 -->
        <div class="bg-white/10 p-6 rounded-lg">
          <label class="block text-sm font-medium text-white mb-2">密码</label>
          <p class="text-xl text-white">••••••••</p>
        </div>

        <!-- 按钮组 -->
        <div class="flex gap-4">
          <button
            @click="enterEditMode"
            class="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
          >
            编辑资料
          </button>
          <button
            @click="handleLogout"
            class="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition"
          >
            退出登录
          </button>
        </div>
      </div>

      <!-- 编辑模式 -->
      <form v-else @submit.prevent="handleUpdate" class="space-y-6">
        <!-- 用户名编辑 -->
        <div>
          <label for="userName" class="block text-sm font-medium text-white mb-2">
            用户名
          </label>
          <input
            id="userName"
            v-model="updateForm.userName"
            type="text"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请输入用户名"
          />
        </div>

        <!-- 新密码 -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2">
            新密码
          </label>
          <input
            id="password"
            v-model="updateForm.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请输入新密码"
          />
        </div>

        <!-- 确认新密码 -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">
            确认新密码
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请再次输入新密码"
          />
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ errorMessage }}
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {{ successMessage }}
        </div>

        <!-- 按钮组 -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">保存修改</span>
            <span v-else>保存中...</span>
          </button>
          <button
            type="button"
            @click="cancelEdit"
            :disabled="isLoading"
            class="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, updateProfile, logout } from '@/apis/userApi'
import { useUserStore } from '@/stores/userStore'
import type { UserRegisterDTO } from '@/types/user'

const router = useRouter()
const userStore = useUserStore()

const isEditMode = ref(false)
const displayUserName = ref('')
const updateForm = ref<UserRegisterDTO>({
  userName: '',
  password: '',
})
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 获取个人信息
const fetchProfile = async () => {
  try {
    const response = await getProfile()
    if (response.code === 200) {
      displayUserName.value = response.data
      updateForm.value.userName = response.data
      // 更新 store 中的用户名
      userStore.setUserName(response.data)
    }
  } catch (error) {
    console.error('获取个人信息失败:', error)
  }
}

// 进入编辑模式
const enterEditMode = () => {
  isEditMode.value = true
  updateForm.value.userName = displayUserName.value
  updateForm.value.password = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

// 取消编辑
const cancelEdit = () => {
  isEditMode.value = false
  updateForm.value.password = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

// 更新个人信息
const handleUpdate = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // 验证密码
    if (updateForm.value.password !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    if (updateForm.value.password.length < 6) {
      errorMessage.value = '密码长度不能少于6位'
      return
    }

    const response = await updateProfile(updateForm.value)

    if (response.code === 200) {
      successMessage.value = '更新成功！'
      displayUserName.value = updateForm.value.userName
      userStore.setUserName(updateForm.value.userName)
      
      // 1秒后退出编辑模式
      setTimeout(() => {
        cancelEdit()
      }, 1000)
    } else {
      errorMessage.value = response.message || '更新失败，请重试'
    }
  } catch (error: any) {
    console.error('更新失败:', error)
    errorMessage.value = error.response?.data?.message || '更新失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await logout()
    userStore.clearUserInfo()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    // 即使失败也清除本地信息
    userStore.clearUserInfo()
    router.push('/login')
  }
}

onMounted(() => {
  // 检查是否已登录
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // 如果 store 中有用户名，直接使用
  if (userStore.userName) {
    displayUserName.value = userStore.userName
    updateForm.value.userName = userStore.userName
  } else {
    // 否则从后端获取
    fetchProfile()
  }
})
</script>

<style scoped>
.my-backdrop-blur-lg {
  background-color: rgba(195, 89, 72, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
