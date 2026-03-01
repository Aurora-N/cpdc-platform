<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12 relative overflow-hidden" style="background-image: url('/introbg.png')">
    <!-- 装饰性背景元素 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary-600/20"></div>

    <!-- 装饰性图案 -->
    <div class="absolute top-10 right-10 w-32 h-32 opacity-10">
      <div class="w-full h-full border-4 border-white rounded-full animate-pulse"></div>
    </div>
    <div class="absolute bottom-10 left-10 w-24 h-24 opacity-10">
      <div class="w-full h-full border-4 border-white rounded-full animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <div class="auth-card w-full max-w-md relative z-10 animate-fade-in">
      <!-- 顶部装饰 -->
      <div class="text-center mb-8">
        <div class="inline-block mb-4">
          <div class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold text-white mb-3 tracking-wide">欢迎回来</h1>
        <p class="text-white/80 text-lg">登录广彩数字文化传播平台</p>
        <div class="w-20 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4"></div>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- 用户名 -->
        <div class="form-group">
          <label for="userName" class="block text-sm font-medium text-white mb-2 ml-1">
            用户名
          </label>
          <input
            id="userName"
            v-model="loginForm.userName"
            type="text"
            required
            class="input-field"
            placeholder="请输入用户名"
          />
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label for="password" class="block text-sm font-medium text-white mb-2 ml-1">
            密码
          </label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            required
            class="input-field"
            placeholder="请输入密码"
          />
        </div>

        <!-- 错误提示 -->
        <transition name="shake">
          <div v-if="errorMessage" class="error-message">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- 登录按钮 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="submit-btn"
        >
          <span v-if="!isLoading" class="flex items-center justify-center gap-2">
            <span>登录</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>登录中...</span>
          </span>
        </button>
      </form>

      <!-- 注册链接 -->
      <div class="mt-8 text-center">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-transparent text-white/70">还没有账号？</span>
          </div>
        </div>
        <router-link
          to="/register"
          class="register-link"
        >
          立即注册
        </router-link>
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
.auth-card {
  background: linear-gradient(135deg, rgba(195, 89, 72, 0.95) 0%, rgba(195, 89, 72, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #1f2937;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.input-field::placeholder {
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  color: #c35948;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 1.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border-radius: 12px;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.register-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.register-link:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.shake-enter-active {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
</style>
