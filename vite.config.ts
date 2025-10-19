import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// 定义 base 路径
const BASE_PATH = '/cpdc-platform/' // 替换为GitHub仓库名称，确保GitHub Pages可以正确访问资源

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: BASE_PATH,
  define: {
    // 将 base 路径暴露给应用
    __BASE_PATH__: JSON.stringify(BASE_PATH),
  },
  server: {
    proxy: {
      // 匹配 /api 开头的请求
      '/api': {
        target: 'https://included-asp-known.ngrok-free.app', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉 /api 前缀
      },
    },
  },
})
