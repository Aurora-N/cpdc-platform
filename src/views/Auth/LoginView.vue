<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background-image: url('/introbg.png')">
    <div class="my-backdrop-blur-lg rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">欢迎回来</h1>
        <p class="text-primary-100">登录您的账户</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- 用户名 -->
        <div>
          <label for="userName" class="block text-sm font-medium text-white mb-2">
            用户名
          </label>
          <input
            id="userName"
            v-model="loginForm.userName"
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
            v-model="loginForm.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-primary-200 rounded-lg bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="请输入密码"
          />
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ errorMessage }}
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">登录</span>
          <span v-else>登录中...</span>
        </button>
      </form>

      <!-- 注册链接 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-primary-100">
          还没有账号？
          <router-link
            to="/register"
            class="text-white font-semibold hover:underline transition"
          >
            立即注册
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/apis/userApi'
import { useUserStore } from '@/stores/userStore'
import type { UserLoginDTO } from '@/types/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginForm = ref<UserLoginDTO>({
  userName: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await login(loginForm.value)

    if (response.code === 200) {
      // 保存用户信息
      userStore.setUserInfo(response.data.token, response.data.userId, loginForm.value.userName)

      // 跳转到之前的页面，或默认跳转到首页
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } else {
      errorMessage.value = response.message || '登录失败，请重试'
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.response?.data?.message || '登录失败，请检查用户名和密码'
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
