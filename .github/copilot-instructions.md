# 项目规则

## 技术栈与全局要求

- 框架与工具：Vue 3.5.13, TypeScript, Vite 6.2.4, Tailwind CSS 4.1.6, Pinia (状态管理), Vue Router
- 构建系统：pnpm
- 代码风格：受 ESLint 和 Prettier 控制。
- 测试框架：Cypress 14

## 开发规范

### 1. 结构与命名

- **组件 (Components)**: 存放在 `src/components/` （按功能子目录）或 `views/功能层/components/`。使用 PascalCase 命名，且文件名以 `Component.vue` 结尾（除非是预定义图标或通用小组件，必须明确表明组件用途）。
- **视图 (Views)**: 存放在 `src/views/` 按模块划分。使用 PascalCase 命名，且文件名以 `View.vue` 结尾。
- **组合式函数 (Composables)**: 使用 `use` 开头组合动作名称（camelCase），如 `useAuth.ts`。
- **工具函数 (Utils)**: 存放在 `src/utils/`，采用 camelCase 命名。
- **API 请求**: 存放在 `src/apis/`，按模块（camelCase, `Api` 结尾，如 `userApi.ts`）划分。
- **类型定义 (Types)**: 存放在 `src/types/`，使用 PascalCase（接口、类型），文件名为 `kebab-case.ts` 或 `.d.ts`。泛型以 `T` 结尾或开头（如 `ApiResponse<T>`）。
- **状态管理 (Stores)**: 存放在 `src/stores/`，使用 kebab-case 命名，以 `-store.ts` 结尾。Store 名称采用 `useXxxStore`（PascalCase）命名。

### 2. Vue 组件编写 (script setup)

- 强制使用 `<script setup lang="ts">` 组合式 API 写法。
- 必须使用 TypeScript 显式定义所有 `defineProps` 与 `defineEmits` 类型。
- 样式推荐首选 Tailwind CSS 类，避免写内联样式 (`style="..."`)。
- 当确实需要覆盖 Tailwind 或使用自定义样式时，使用 `<style scoped>`。通用样式放在 `src/assets/main.css`。

### 3. API 与状态的交互规范

- 所有 API 函数必须显式标注返回类型（例如 `Promise<ApiResponse<T>>`）。
- API 参数尽可能使用 `URLSearchParams` 以保证兼容性。
- API 服务使用统一封装的 `apiClient` 实例，处理通用业务逻辑（Token 等）。
- API 类型定义放置于 `src/types/api.type.ts`。
- Store 必须使用 **组合式Store (Setup Store)** 的写法，所有 ref、computed、function 都需要显式的类型定义。

### 4. 样式使用 (Tailwind CSS 最佳实践)

- **Mobile First (移动优先)**: 编写响应式样式时，始终秉持移动设备优先原则，即默认样式服务于小屏，再通过 `sm:`, `md:`, `lg:` 等断点修饰符向上覆盖。
- **避免臃肿的 Class 列表**: 若某个元素的 Utility Classes 超过 8 个且显得极其臃肿，或者包含较多复杂的动态拼接，应优先考虑提取为 Vue 组件。如果是单纯的静态样式复用，可使用 `@apply` 提取到 `<style scoped>` 中。
- **类名排序一致性**: 保持类名的书写顺序（推荐顺序：布局定位 -> 盒模型(宽高/间距) -> 排版(字体/对齐) -> 视觉(颜色/阴影) -> 交互状态）。
- **动态类名管理**: 若项目中存在类似 `cn()` 或 `clsx` / `tailwind-merge` 的工具，建议使用它们进行动态样式合并，避免类名冲突。
- **审慎使用任意值 (Arbitrary values)**: 尽量使用 Tailwind 配置文件中已定义的尺寸和颜色主题。除了特别特殊的场景外，应尽量减少类似于 `w-[31px]` 或 `text-[#123456]` 的硬编码，以保障 UI 统一性。

### 5. 工程与代码架构实践

- **遵循 DRY 原则 (Don't Repeat Yourself)**: 高度重视代码的复用性。如果在编写时发现要在多处重复相同的逻辑代码或相似的 UI 结构，**必须**主动考虑将其抽象为功能明确的公共组件、组合式函数 (Composables) 或工具函数 (Utils)。
- **单一职责原则 (Single Responsibility)**: 鼓励组件和函数保持细粒度与单一责任。如果长视图组件业务逻辑堆积或 DOM 结构过于臃肿，要求将其合理的拆解为多个子组件以保障代码维护性与直观性。
- **自描述与清晰度**: 变量和方法名需要清晰易懂具备良好的自解释能力（即代码即注释），在提供代码前思考接手人是否能轻易理解你给出的业务逻辑。
- **语义化标签 (Semantic HTML)**: 编写 Vue 模板时，尽量避免“Div 乱炖”（Div-soup）。优先使用明确表达内容结构的 HTML5 语义化标签（如 `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` 以及原生的表单和交互控件等），提升代码可读性与无障碍访问 (A11y)。

## 交互原则

- 修改/创建代码前，如果缺乏上下文，请先使用语义搜索和文件工具了解所在目录的常规结构。
- 提供的代码应保持简洁且可直接用作工程实现，严格遵循以上命名规范。
- 避免过度提供非要求的模块代码；当创建新文件时，需要同时生成正确的导出与类型。
