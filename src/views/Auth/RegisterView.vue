<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background-image: url('/introbg.png')">
    <div class="my-backdrop-blur-lg rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">创建账户</h1>
        <p class="text-primary-100">加入广彩数字文化传播平台</p>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- 用户名 -->
        <div>
          <label for="userName" class="block text-sm font-medium text-white mb-2">
            用户名
          </label>
          <input
            id="userName"
            v-model="registerForm.userName"
            type="text"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请输入用户名"
          />
        </div>

        <!-- 密码 -->
        <div>
          <label for="password" class="block text-sm font-medium text-white mb-2">
            密码
          </label>
          <input
            id="password"
            v-model="registerForm.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请输入密码"
          />
        </div>

        <!-- 确认密码 -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">
            确认密码
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请再次输入密码"
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

        <!-- 注册按钮 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">注册</span>
          <span v-else>注册中...</span>
        </button>
      </form>

      <!-- 登录链接 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-primary-100">
          已有账号？
          <router-link
            to="/login"
            class="text-white font-semibold hover:underline transition"
          >
            立即登录
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/apis/userApi'
import type { UserRegisterDTO } from '@/types/user'

const router = useRouter()

const registerForm = ref<UserRegisterDTO>({
  userName: '',
  password: '',
})

const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // 验证密码
    if (registerForm.value.password !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }

    if (registerForm.value.password.length < 6) {
      errorMessage.value = '密码长度不能少于6位'
      return
    }

    const response = await register(registerForm.value)

    if (response.code === 200) {
      successMessage.value = '注册成功！即将跳转到登录页面...'
      
      // 2秒后跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = response.message || '注册失败，请重试'
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    errorMessage.value = error.response?.data?.message || '注册失败，请重试'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.my-backdrop-blur-lg {
  background-color: rgba(195, 89, 72, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
