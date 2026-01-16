<template>
  <header
    class="h-18 bg-primary flex px-3 md:px-5 md:h-20 lg:px-15 justify-between relative items-center"
  >
    <!-- Header Left - Logo & Title -->
    <div>
      <h1 class="text-xl md:text-2xl font-semibold text-white sm:mb-0.5 md:mb-1">
        广彩数字文化传播平台
      </h1>
      <span class="text-sm md:text-md font-semibold text-white"
        >Canton Porcelation Digital Cultural Platform</span
      >
    </div>
    <!-- Header Right - toggle nav bar -->
    <div class="items-center hidden lg:flex">
      <div
        v-for="item of navItem"
        class="text-lg text-primary-100 px-4 py-2 flex items-center justify-center rounded-sm mr-2 last:mr-0 hover:text-white hover:bg-primary-200 ease-in-out duration-200"
        :class="selectedItemLink === item.link ? 'text-white bg-primary-500' : ''"
        :key="item.name"
        :title="`前往${item.name}页面`"
        @click="setActiveItem(item)"
      >
        {{ item.name }}
        <ArrowDown class="text-2xl ml-1" v-if="item.subitems" />
      </div>
      <!-- 用户图标 -->
      <div
        class="text-2xl text-primary-100 px-3 py-2 flex items-center justify-center rounded-sm hover:text-white hover:bg-primary-200 ease-in-out duration-200 cursor-pointer"
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
        class="text-2xl text-primary-100 p-1 flex items-center justify-center cursor-pointer"
        :title="userStore.isLoggedIn ? '个人中心' : '登录 / 注册'"
        @click="handleUserIconClick"
      >
        <UserIcon />
      </div>
      <!-- 移动端菜单按钮 -->
      <button
        class="text-xl text-primary-100 p-1 flex items-center justify-center"
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
      class="w-full absolute top-16 md:top-23.5 visible lg:invisible z-50"
    >
      <div class="my-backdrop-blur-lg">
        <div
          v-for="item of navItem"
          class="text-md text-primary-100 px-3 md:px-5 py-2 flex items-center justify-between"
          :class="selectedItemLink === item.link ? 'text-white bg-primary-300/50' : ''"
          :key="item.name"
          :title="`前往${item.name}页面`"
          @click="setActiveItem(item)"
        >
          {{ item.name }}
          <ArrowDown class="text-2xl ml-1" v-if="item.subitems" />
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

const route = useRoute()
const userStore = useUserStore()

const selectedItemLink = ref<string>('/')

const navItem: NavItemType[] = [
  {
    name: '关于我们',
    link: '/about',
    subitems: [],
  },
  {
    name: '展厅',
    link: '/exhibition_hall',
    subitems: [],
  },
  {
    name: '藏品库',
    link: '/collections',
    subitems: [],
  },
  {
    name: '首页',
    link: '/',
  },
]

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
      query: { redirect: route.fullPath }
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
