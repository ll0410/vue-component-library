# VCL Vue 组件库

一个基于 Vue 3 + TypeScript 的组件库工程，采用 pnpm Monorepo 管理，内置 Storybook 组件开发环境、Vitest 单元测试、VitePress 文档站与 Changesets 版本发布流程。

本项目同时是一份**从零上手组件库开发的学习指南**，配套 8 章开发文档，覆盖架构设计、脚手架初始化、组件规范、Storybook、单元测试、文档站、构建发布与完整实战。

## 特性

- **Vue 3.5 + TypeScript 5** — `<script setup>` 组合式 API，完整的类型声明
- **Vite Library Mode** — 同时产出 ESM / CJS / `d.ts`，支持 tree-shaking
- **Monorepo** — pnpm workspace 管理组件包与文档站，各自独立构建
- **Storybook 10** — 组件独立开发、调试、交互式文档
- **Vitest + Vue Test Utils** — 组件行为级单元测试
- **VitePress 文档站** — Markdown 编写，支持组件实时演示
- **Changesets** — 语义化版本与 CHANGELOG 自动生成
- **主题化** — 样式基于 CSS Variables，支持运行时换肤

## 环境要求

| 依赖 | 版本 |
|------|------|
| Node.js | >= 18 |
| pnpm | 10.x（`corepack enable` 可自动启用） |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动 Storybook 组件预览（http://127.0.0.1:6006）
pnpm storybook

# 启动 VitePress 文档站（http://localhost:5173）
pnpm docs
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有依赖 |
| `pnpm storybook` | 启动 Storybook 开发环境 |
| `pnpm docs` | 启动 VitePress 文档站 |
| `pnpm playground` | 启动组件库接入示例应用 |
| `pnpm test` | 运行全部测试 |
| `pnpm test:components` | 仅运行组件库测试 |
| `pnpm build` | 构建所有包 |
| `pnpm build:components` | 构建组件库（TS 类型检查 + Vite 构建） |
| `pnpm build:docs` | 构建文档站 |
| `pnpm lint` | ESLint 检查并自动修复 |
| `pnpm changeset` | 添加版本变更记录 |
| `pnpm version` | 应用 changeset 到 package.json |
| `pnpm release` | 发布到 npm |

## 目录结构

```
Vue Component Library/
├── packages/
│   ├── components/              # 组件库（对外发布）
│   │   ├── .storybook/          # Storybook 配置
│   │   ├── src/
│   │   │   ├── button/          # 每个组件一个目录
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── dialog/
│   │   │   ├── styles/          # 组件样式
│   │   │   ├── shared/          # 公共工具
│   │   │   └── index.ts         # 统一出口
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── docs/                    # VitePress 文档站
│       ├── docs/
│       │   ├── .vitepress/      # 站点配置与主题
│       │   ├── guide/           # 9 章开发指南
│       │   └── components/      # 组件文档
│       └── package.json
├── apps/
│   └── playground/              # 组件库接入示例应用（不发布）
├── .changeset/                  # Changesets 配置
├── AGENTS.md                    # 开发规范（含提交规范）
└── package.json
```

## 组件

| 组件 | 说明 | 文档 |
|------|------|------|
| `Button` | 按钮，支持多种类型、尺寸、加载与禁用态 | [button](packages/docs/docs/components/button.md) |
| `Input` | 输入框，支持清空、前后缀插槽、尺寸 | [input](packages/docs/docs/components/input.md) |
| `Select` | 下拉选择器，支持禁用选项、清空、键盘关闭 | [select](packages/docs/docs/components/select.md) |
| `Dialog` | 对话框，支持 Teleport、Esc / 遮罩关闭、自定义页脚 | [dialog](packages/docs/docs/components/dialog.md) |

## 使用组件库

```bash
pnpm add @vcl/components
```

企业内部私服安装需先配置 `.npmrc`，参见 [企业内使用](packages/docs/docs/guide/09-enterprise-usage.md) 与根目录 `.npmrc.example`。

```ts
import { Button, Input } from '@vcl/components';
import '@vcl/components/style.css';
```

```vue
<template>
  <Button type="primary" size="small" @click="onClick">提交</Button>
  <Input v-model="keyword" placeholder="请输入" clearable />
</template>
```

如需全局注册：

```ts
import { createApp } from 'vue';
import { Button, Input, Select, Dialog } from '@vcl/components';
import '@vcl/components/style.css';

const app = createApp(App);
[Button, Input, Select, Dialog].forEach((c) => app.component(c.name!, c));
app.mount('#app');
```

## 添加新组件

1. 在 `packages/components/src/{component-name}/` 下创建 `Component.vue`、`index.ts`、`*.stories.ts`、`*.spec.ts`
2. 在 `src/index.ts` 中导出组件与类型
3. 补充 `src/styles/{component-name}.css`
4. 在 `packages/docs/docs/components/` 下新增文档，并注册到 `.vitepress/config.ts` 侧边栏
5. 运行 `pnpm test:components` 与 `pnpm build:components` 验证
6. 提交前执行 `pnpm changeset` 记录版本变更

命名遵循 BEM：`.ml-btn` / `.ml-btn--primary` / `.ml-btn__icon`。

## 开发指南

文档站 `guide/` 目录包含 8 章内容：

1. 架构设计与技术选型
2. Monorepo 项目初始化
3. 组件开发规范与流程
4. Storybook 组件开发
5. 单元测试策略
6. VitePress 文档站
7. 构建与 npm 发布
8. 实战：从零造一个 Button
9. 企业内使用（私服发布、版本策略、消费方接入）

本地执行 `pnpm docs` 后访问 `/guide/01-architecture` 阅读。

## 贡献

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>
```

常用 type：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `build` / `ci` / `chore`。
scope 使用 `components`、`docs` 或具体组件名。

## License

MIT
