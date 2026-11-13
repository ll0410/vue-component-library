# 架构设计与技术选型

> 开始编码之前，先想清楚「为什么」和「怎么选」。

## 1.1 为什么做组件库？

| 痛点 | 组件库如何解决 |
|------|---------------|
| 多项目 UI 风格不统一 | 统一视觉规范，一套代码多处复用 |
| 每个项目重复造轮子 | 沉淀通用组件，一次维护 |
| 新人上手需要了解业务细节 | 组件与业务解耦，独立可测试 |
| 缺少设计系统（Design System） | 组件库是设计系统的代码载体 |

## 1.2 Monorepo vs Polyrepo

| 维度 | Monorepo ✅ | Polyrepo |
|------|-----------|----------|
| 跨包联调 | 软链接直接引用 | 需要 npm link 或发布到测试源 |
| 依赖管理 | 统一一个 lockfile | 每个仓库独立 |
| 版本统一 | Changesets 自动关联 | 手动协调多仓库版本 |
| CI/CD | 一次构建所有包 | 需要跨仓库触发 |
| 权限 | 粒度较粗 | 可按仓库细分 |

**结论**：组件库这类紧密关联的多包项目 → **Monorepo**。

## 1.3 为什么选 pnpm Workspace？

```
npm workspaces    → 最流行，但依赖提升策略较粗犷
yarn workspaces   → 也不错，yarn berry (v2+) 配置复杂
pnpm workspaces  → 最严格的依赖隔离 + 磁盘空间优化 + 原生 workspace 协议
```

pnpm 的核心优势：
- **严格隔离**：每个包只能访问自己声明的依赖，幽灵依赖零容忍
- **硬链接存储**：所有项目共用一份 node_modules 实体，磁盘占用极小
- **workspace 协议**：`@my-lib/components` 直接指向本地包，联调零成本

## 1.4 推荐技术栈全景

```
┌─────────────────────────────────────────────────────┐
│                 VCL Monorepo                        │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   components │  │    docs      │  │  playground │ │
│  │   (组件包)    │  │ (VitePress)  │  │  (调试页)    │ │
│  └──────┬───────┘  └──────────────┘  └─────────────┘ │
│         │                                              │
│  ┌──────▼──────────────────────────────────────────┐  │
│  │  Vue 3.5 + TypeScript 5 + Vite 8               │  │
│  │  Storybook 10 · Vitest 5 · vite-plugin-dts 5    │  │
│  │  ESLint 9 · Prettier 3 · Stylelint 16           │  │
│  │  Changesets 3 (版本管理)                         │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 各工具的角色

| 工具 | 版本 | 做什么 | 为什么选它 |
|------|------|--------|-----------|
| Vue 3 | ^3.5 | 组件运行时 | Composition API + `<script setup>` 是现代标准 |
| TypeScript | ^5.7 | 类型安全 | 组件库的类型质量直接决定用户体验 |
| Vite | ^8 | 构建 & 开发服务器 | Library Mode 零配置即可产出 ESM/CJS |
| vite-plugin-dts | ^5 | 自动生成 .d.ts | 省去单独跑 vue-tsc --emitDeclarationOnly |
| Storybook | ^10 | 组件开发环境 + 预览 | 每个组件独立可看，支持 controls/knobs |
| Vitest | ^5 | 单元测试 | 与 Vite 共用底层，极速，Vue Test Utils 官方推荐 |
| VitePress | ^1.5 | 文档站 | Vite 同生态，Markdown + Vue 组件灵活组合 |
| Changesets | ^3 | 版本管理 & 发布 | monorepo 版本号联动 + CHANGELOG 自动生成 |

## 1.5 各包职责划分

```
packages/
├── components/   ← 核心组件库（对外发布到 npm）
├── docs/         ← 文档站（内部或部署到 Vercel/Netlify）
└── playground/   ← 可选：不依赖 Storybook 的最小调试页
```

### 包之间的依赖方向

```
components ← docs          (文档站引用组件进行实时演示)
components ← playground    (playground 引用组件进行联调)
```

**关键原则**：`components` 不能依赖 `docs` 或 `playground`，单向依赖。

## 1.6 设计原则速查

在动手写第一个组件之前，牢记以下原则：

1. **单一职责**：一个组件只做一件事（Button 只管按钮，不管表单校验）
2. **语义化命名**：Props / Emits / 组件名让人一看就懂
3. **类型优先**：每个 Props 都要有明确的 TS 类型
4. **可组合**：通过 slot / 嵌套组件让组件可灵活组装
5. **无障碍（a11y）**：遵循 WAI-ARIA 规范，提供键盘导航
6. **主题化**：样式基于 CSS Variables，支持运行时换肤
