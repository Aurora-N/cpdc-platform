<template>
  <header class="bg-primary flex px-3 md:px-5 lg:px-15 py-3 justify-between relative">
    <!-- Header Left - Logo & Title -->
    <div>
      <h1 class="text-2xl md:text-3xl font-semibold text-white sm:mb-0.5 md:mb-1.5">
        广彩数字文化传播平台
      </h1>
      <span class="text-sm md:text-lg font-semibold text-white"
        >Canton Porcelation Digital Cultural Platform</span
      >
    </div>
    <!-- Header Right - toggle nav bar -->
    <div class="items-center hidden lg:flex">
      <div
        v-for="item of navItem"
        class="text-xl text-primary-100 px-4 py-2 flex items-center justify-center rounded-sm mr-2 last:mr-0 hover:text-white hover:bg-primary-200 ease-in-out duration-200"
        :class="selectedItem === item.name ? 'text-white bg-primary-500' : ''"
        :key="item.name"
        :title="`前往${item.name}页面`"
        @click="setActiveItem(item)"
      >
        {{ item.name }}
        <ArrowDown class="text-2xl ml-1" v-if="item.subitems" />
      </div>
    </div>

    <!-- 移动端菜单按钮 -->
    <div class="flex items-center lg:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
      <button
        class="text-xl text-primary-100 p-1 flex items-center justify-center"
        title="打开主菜单"
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
      class="w-full absolute top-20 md:top-23.5 lg:hidden overflow-hidden z-50 backdrop-blur-sm"
    >
      <div class="bg-primary-700/70">
        <div
          v-for="item of navItem"
          class="text-md text-primary-100 px-3 md:px-5 py-2 flex items-center justify-between"
          :class="selectedItem === item.name ? 'text-white bg-primary-300/50' : ''"
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
import { ref } from 'vue'
import router from '@/router/index'
import type { NavItemType } from '@/types/ui'
import ArrowDown from '@/components/icons/ArrowDown.vue'
import NavMenu from '@/components/icons/NavMenu.vue'
import NavMenuClose from '@/components/icons/NavMenuClose.vue'

const selectedItem = ref<string>('首页')

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
  selectedItem.value = item.name
  router.push(item.link)
  isMobileMenuOpen.value = false
}

// 移动端菜单
const isMobileMenuOpen = ref(false)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s ease-out;
  max-height: 300px;
  opacity: 1;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
