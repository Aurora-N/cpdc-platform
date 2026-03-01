# 项目规则

## 技术栈

- Vue 3.5.13
- TypeScript
- Vite 6.2.4
- Tailwind CSS 4.1.6
- ESLint 9.22.0
- Prettier 3.5.3
- Cypress 14.3.3
- 包管理工具采用 pnpm

## 目录结构

- `src/` 项目源代码目录
  - `apis/` API 接口定义目录
  - `assets/` 静态资源目录
  - `components/` 公用组件目录
  - `composables/` 组合函数目录(如：`useFetch.ts`)
  - `router/` 路由配置目录
  - `stores/` 状态管理目录
  - `types/` 类型定义目录
  - `utils/` 工具函数目录
  - `views/` 页面视图目录，在此编写主要页面，页面专有的组件放在对应子目录的 `components/` 目录下
  - `App.vue` 应用入口文件
  - `main.ts` 应用主文件
- `public/` 公开静态资源目录
- `package.json` 项目依赖配置文件
- `tsconfig.json` TypeScript 配置文件
- `vite.config.ts` Vite 配置文件

## 代码规范

| 类别              | 规则                             | 示例                         |
| ----------------- | -------------------------------- | ---------------------------- |
| 组件文件          | PascalCase，结尾为 `Component`   | `UserCardComponent.vue`      |
| 页面文件          | PascalCase，结尾为 `View`        | `DashboardView.vue`          |
| 组合式函数        | `use` 开头 + 动作名（camelCase） | `useAuth.ts`                 |
| 工具函数          | camelCase                        | `formatDate.ts`              |
| API 接口文件      | camelCase，结尾为 `Api`          | `userApi.ts`                 |
| 类型定义          | PascalCase                       | `UserInfo`, `ApiResponse<T>` |
| 状态管理（Pinia） | kebab-case                       | `user-store.ts`              |
| 路由文件          | kebab-case                       | `router/index.ts`            |

## 组件开发规范

- 必须使用 组合式 API (script setup)。
- `<script lang="ts" setup>` 必须包含显式类型定义。
- defineProps 与 defineEmits 必须声明类型。
- 样式应使用 Tailwind CSS，禁止内联 style。
- 无法覆盖的样式使用 `<style scoped>`。
- 通用样式集中放置于 `src/assets/main.css`。

## 类型定义规范

- 所有 API、Pinia Store、Props 必须定义明确类型。
- 全部类型集中放置于 `src/types/` 目录。
- 文件名：`kebab-case.ts` 或 `.d.ts`。
- 泛型命名以 T 开头：`ApiResponse<T>`、`PaginatedResult<T>`。

## 状态管理（Pinia）

- 所有 Store 文件以 `-store.ts` 结尾。
- 使用 **组合式Store（Setup Store）** 写法，完全遵循 Vue 3 组合式 API 风格。
- Store 名称采用 `useXxxStore`（PascalCase）命名。
- 所有 ref、computed、function 都需显式类型定义。

## API 请求规范

- 所有请求文件放在 `src/apis/` 目录下，按功能模块划分（如 `userApi.ts`, `exhibitionApi.ts`）。
- 每个接口函数都应显式声明返回类型（如 `Promise<ApiResponse<T>>`）。
- 请求逻辑通过封装好的 `apiClient` 实例实现（统一拦截、错误处理、Token 注入）。
- URL 参数建议使用 `URLSearchParams` 构建，确保兼容性与可维护性。
- 请求参数和返回值类型定义统一放置于 `src/types/api.type.ts`。

## Tailwind CSS 使用规范

- 优先使用 Tailwind Utility Class 实现布局。
- 复用样式可使用 `@apply`。
- 常用主题（颜色、间距、阴影）统一配置在 `tailwind.config.js`。
- 超过 8 个 utility class 的复杂样式应提取为组件或自定义类。
