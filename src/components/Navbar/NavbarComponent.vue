<template>
  <header class="bg-primary flex px-15 py-3 justify-between">
    <!-- Header Left - Logo & Title -->
    <div>
      <h1 class="text-3xl font-semibold text-white mb-1.5">广彩数字文化传播平台</h1>
      <span class="text-lg font-semibold text-white"
        >Canton Porcelation Digital Cultural Platform</span
      >
    </div>
    <!-- Header Right - toggle nav bar -->
    <div class="flex items-center">
      <div
        v-for="item of navItem"
        class="text-xl text-primary-100 px-4 py-2 flex items-center justify-center rounded-sm mr-2 last:mr-0 hover:text-white hover:bg-primary-200 ease-in-out duration-200"
        :class="selectedItem === item.name ? activedStyle : ''"
        :key="item.name"
        @click="setActiveItem(item)"
      >
        {{ item.name }}
        <ArrowDown class="text-2xl ml-1" v-if="item.subitems" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/index'
import type { NavItemType } from '@/types/ui'
import ArrowDown from '@/components/icons/ArrowDown.vue'

const activedStyle = 'text-white bg-primary-300'

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
}
</script>
