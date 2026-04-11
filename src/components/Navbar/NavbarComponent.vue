<template>
  <header
    class="bg-primary relative flex h-18 items-center justify-between px-3 md:h-20 md:px-5 lg:px-15"
  >
    <!-- Header Left - Logo & Title -->
    <div>
      <h1 class="text-xl font-semibold text-white sm:mb-0.5 md:mb-1 md:text-2xl">
        广彩数字文化传播平台
      </h1>
      <span class="md:text-md text-sm font-semibold text-white"
        >Canton Porcelation Digital Cultural Platform</span
      >
    </div>
    <!-- Header Right - toggle nav bar -->
    <div class="hidden items-center lg:flex">
      <div
        v-for="item of navItem"
        class="text-primary-100 hover:bg-primary-200 mr-2 flex items-center justify-center rounded-sm px-4 py-2 text-lg duration-200 ease-in-out last:mr-0 hover:text-white"
        :class="selectedItemLink === item.link ? 'bg-primary-500 text-white' : ''"
        :key="item.name"
        :title="`前往${item.name}页面`"
        @click="setActiveItem(item)"
      >
        {{ item.name }}
        <ArrowDown class="ml-1 text-2xl" v-if="item.subitems" />
      </div>
      <!-- 用户图标 -->
      <div
        class="text-primary-100 hover:bg-primary-200 flex cursor-pointer items-center justify-center rounded-sm px-3 py-2 text-2xl duration-200 ease-in-out hover:text-white"
        :title="userStore.isLoggedIn ? '个人中心' : '登录 / 注册'"
        @click="handleUserIconClick"
      >
        <UserIcon />
      </div>
    </div>

    <!-- 移动端菜单按钮和用户图标 -->
    <div class="flex items-center gap-2 lg:hidden">
      <!-- 移动端用户图标 -->
      <div
        class="text-primary-100 flex cursor-pointer items-center justify-center p-1 text-2xl"
        :title="userStore.isLoggedIn ? '个人中心' : '登录 / 注册'"
        @click="handleUserIconClick"
      >
        <UserIcon />
      </div>
      <!-- 移动端菜单按钮 -->
      <button
        class="text-primary-100 flex items-center justify-center p-1 text-xl"
        title="打开主菜单"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span class="sr-only">打开主菜单</span>
        <NavMenu v-if="!isMobileMenuOpen" />
        <NavMenuClose v-else />
      </button>
    </div>
  </header>

  <!-- 移动端菜单展开 -->
  <Transition name="slide-down">
    <div
      v-if="isMobileMenuOpen"
      class="visible absolute top-16 z-50 w-full md:top-23.5 lg:invisible"
    >
      <div class="my-backdrop-blur-lg">
        <div
          v-for="item of navItem"
          class="text-md text-primary-100 flex items-center justify-between px-3 py-2 md:px-5"
          :class="selectedItemLink === item.link ? 'bg-primary-300/50 text-white' : ''"
          :key="item.name"
          :title="`前往${item.name}页面`"
          @click="setActiveItem(item)"
        >
          {{ item.name }}
          <ArrowDown class="ml-1 text-2xl" v-if="item.subitems" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import router from '@/router/index'
import { useRoute } from 'vue-router'
import type { NavItemType } from '@/types/ui'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import NavMenu from '@/components/icons/NavMenu.vue'
import NavMenuClose from '@/components/icons/NavMenuClose.vue'
import UserIcon from '@/components/icons/UserIcon.vue'
import { useUserStore } from '@/stores/userStore'
import { navItem } from '@/data/navigation'

const route = useRoute()
const userStore = useUserStore()

const selectedItemLink = ref<string>('/')

const setActiveItem = (item: NavItemType) => {
  selectedItemLink.value = item.link
  router.push(item.link)
  isMobileMenuOpen.value = false
}

// 移动端菜单
const isMobileMenuOpen = ref(false)

// 处理用户图标点击
const handleUserIconClick = () => {
  if (userStore.isLoggedIn) {
    // 已登录，跳转到个人信息页面
    router.push('/profile')
  } else {
    // 未登录，跳转到登录页面，并保存当前路径
    router.push({
      path: '/login',
      query: { redirect: route.fullPath },
    })
  }
  isMobileMenuOpen.value = false
}

onMounted(() => {
  router.isReady().then(() => {
    const currentPath = route.path
    console.log(currentPath)
    selectedItemLink.value = currentPath
  })
})
</script>
