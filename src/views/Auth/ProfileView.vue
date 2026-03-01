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

    <div class="profile-card w-full max-w-lg relative z-10 animate-fade-in">
      <!-- 顶部装饰 -->
      <div class="text-center mb-6">
        <div class="inline-block mb-3">
          <div class="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2 tracking-wide">个人中心</h1>
        <p class="text-white/80 text-sm">管理您的账户信息</p>
        <div class="w-16 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-3"></div>
      </div>

      <!-- 查看模式 -->
      <div v-if="!isEditMode" class="space-y-4">
        <!-- 用户信息卡片 -->
        <div class="info-card-group">
          <!-- 用户名显示 -->
          <div class="info-card">
            <div class="info-icon">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <label class="info-label">用户名</label>
              <p class="info-value">{{ displayUserName }}</p>
            </div>
          </div>
        </div>

        <!-- 按钮组 -->
        <div class="button-group">
          <button
            @click="enterEditMode"
            class="primary-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>编辑资料</span>
          </button>
          <button
            @click="handleLogout"
            class="secondary-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <!-- 编辑模式 -->
      <form v-else @submit.prevent="handleUpdate" class="space-y-4">
        <!-- 用户名编辑 -->
        <div class="form-group">
          <label for="userName" class="block text-xs font-medium text-white/90 mb-2 ml-1 uppercase tracking-wide">
            用户名
          </label>
          <input
            id="userName"
            v-model="updateForm.userName"
            type="text"
            required
            class="input-field"
            placeholder="请输入用户名"
          />
        </div>

        <!-- 新密码 -->
        <div class="form-group">
          <label for="password" class="block text-xs font-medium text-white/90 mb-2 ml-1 uppercase tracking-wide">
            新密码
          </label>
          <input
            id="password"
            v-model="updateForm.password"
            type="password"
            required
            class="input-field"
            placeholder="请输入新密码（至少6位）"
          />
        </div>

        <!-- 确认新密码 -->
        <div class="form-group">
          <label for="confirmPassword" class="block text-xs font-medium text-white/90 mb-2 ml-1 uppercase tracking-wide">
            确认新密码
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="请再次输入新密码"
          />
        </div>

        <!-- 错误提示 -->
        <transition name="shake">
          <div v-if="errorMessage" class="error-message">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- 成功提示 -->
        <transition name="fade">
          <div v-if="successMessage" class="success-message">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>{{ successMessage }}</span>
          </div>
        </transition>

        <!-- 按钮组 -->
        <div class="button-group mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="primary-btn"
          >
            <span v-if="!isLoading" class="flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>保存修改</span>
            </span>
            <span v-else class="flex items-center gap-1.5">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>保存中...</span>
            </span>
          </button>
          <button
            type="button"
            @click="cancelEdit"
            :disabled="isLoading"
            class="secondary-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>取消</span>
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

  // 每次访问都从后端获取最新数据
  fetchProfile()
})
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, rgba(195, 89, 72, 0.95) 0%, rgba(195, 89, 72, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.info-card-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.12);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.info-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.info-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  word-break: break-all;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  color: #c35948;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.secondary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-field {
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: #1f2937;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.input-field::placeholder {
  color: #9ca3af;
  font-size: 0.85rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border-radius: 10px;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem;
  background: rgba(34, 197, 94, 0.95);
  color: white;
  border-radius: 10px;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
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

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .button-group {
    grid-template-columns: 1fr;
  }

  .profile-card {
    padding: 1.5rem 1.25rem;
  }

  .info-value {
    font-size: 1rem;
  }
}
</style>
