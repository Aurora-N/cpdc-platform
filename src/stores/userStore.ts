import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userId = ref<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  )
  const userName = ref<string>(localStorage.getItem('userName') || '')

  const isLoggedIn = computed(() => !!token.value)

  // 设置用户信息
  const setUserInfo = (newToken: string, newUserId: number, newUserName?: string) => {
    token.value = newToken
    userId.value = newUserId
    if (newUserName) {
      userName.value = newUserName
    }

    localStorage.setItem('token', newToken)
    localStorage.setItem('userId', String(newUserId))
    if (newUserName) {
      localStorage.setItem('userName', newUserName)
    }
  }

  // 更新用户名
  const setUserName = (newUserName: string) => {
    userName.value = newUserName
    localStorage.setItem('userName', newUserName)
  }

  // 清除用户信息
  const clearUserInfo = () => {
    token.value = ''
    userId.value = null
    userName.value = ''

    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
  }

  return {
    token,
    userId,
    userName,
    isLoggedIn,
    setUserInfo,
    setUserName,
    clearUserInfo,
  }
})
