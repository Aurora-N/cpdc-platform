<template>
  <footer class="mt-auto w-full">
    <!-- 顶部窄条 -->
    <div class="h-2 w-full bg-[#a16a5f]"></div>

    <!-- 剩余宽背景颜色 -->
    <div
      class="flex w-full flex-col items-center justify-between bg-[#935248] px-6 py-10 text-white md:flex-row md:px-12 lg:px-20"
    >
      <!-- 左右局左侧：中英文标题 -->
      <div class="mb-6 flex flex-col items-center md:mb-0 md:items-start">
        <h2 class="mb-2 text-xl font-semibold md:text-2xl">广彩数字文化传播平台</h2>
        <span class="text-sm font-semibold opacity-90 md:text-base">
          Canton Porcelation Digital Cultural Platform
        </span>
      </div>

      <!-- 左右局右侧：导航栏 -->
      <nav>
        <ul class="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <li v-for="item in navItem" :key="item.name">
            <router-link
              :to="item.link"
              class="text-base font-medium text-white/80 transition-colors duration-200 hover:text-white"
              :title="`前往${item.name}页面`"
            >
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { navItem } from '@/data/navigation'
</script>
