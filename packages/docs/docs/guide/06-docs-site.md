# VitePress 文档站

> 没有文档的组件库 = 没有发布。

## 6.1 为什么选 VitePress？

| 对比 | VitePress | Docusaurus | GitBook |
|------|-----------|------------|---------|
| 构建工具 | Vite（极速） | Webpack（较慢） | SaaS |
| Markdown 扩展 | Vue 组件内嵌支持 | MDX | 基础 |
| 生态 | Vue 同生态，SSR 友好 | React 生态 | 闭源 |
| 自定义 | 完全可定制 | 中等 | 有限 |
| 部署 | 静态文件，任何地方 | 静态文件 | 付费托管 |

## 6.2 快速初始化

```bash
cd packages/docs
pnpm add -D vitepress vue
```

### 目录结构

```
packages/docs/
├── package.json
└── docs/
    ├── .vitepress/
    │   ├── config.ts          ← 站点配置（VitePress 只认这个路径）
    │   └── theme/
    │       └── index.ts       ← 主题扩展（注册全局组件）
    ├── index.md               ← 首页
    ├── guide/                 ← 指南
    │   ├── 01-architecture.md
    │   ├── 02-init.md
    │   └── ...
    └── components/            ← 组件文档
        └── button.md
```

::: warning 配置文件位置是唯一约定
VitePress 只读取 `<root>/.vitepress/config.ts`。把配置放在 `packages/docs/vitepress.config.ts` 这类位置**不会生效**，
表现为站点标题、导航、侧边栏全部丢失（且没有任何报错）。
:::

## 6.3 .vitepress/config.ts 配置

```ts
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'VCL Vue 组件库',
  description: '从零打造企业级 Vue 3 组件库',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    // 顶部导航
    nav: [
      { text: '指南', link: '/guide/what-is-vue-lib' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/' }
    ],

    // 侧边栏（可按路径分组）
    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '架构设计与技术选型', link: '/guide/01-architecture' },
            { text: 'Monorepo 项目初始化', link: '/guide/02-init' }
          ]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 VCL'
    },

    // 本地搜索
    search: { provider: 'local' }
  }
});
```

## 6.4 三种文档页面

### 1. 指南文档（纯 Markdown）

```md
# 标题

这里是正文内容，支持**加粗**、`行内代码`、`代码块`等标准 Markdown。

## 代码块

```ts
import { Button } from '@my-lib/components';
```

## 警告/提示

::: tip 提示
这是一个友好的提示
:::

::: warning 警告
注意这里可能有坑
:::

::: danger 危险
千万别这么做
:::
```

### 2. 组件文档（Markdown + Vue 组件嵌入）

```md
---
title: Button 按钮
order: 1
---

# Button 按钮

## 基础用法

<Button type="primary">主要按钮</Button>

::: details 查看代码
```vue
<Button type="primary">主要按钮</Button>
```
:::

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'primary' \| 'success' \| ...` | `'default'` | 按钮类型 |
| size | `'large' \| 'medium' \| 'small'` | `'medium'` | 按钮尺寸 |
```

### 3. 自动导入组件

```ts
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

// 导入组件库（使用 workspace 协议）
import { Button } from '@my-lib/components';
import '@my-lib/components/style.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Button', Button);  // 全局注册
  }
} satisfies Theme;
```

这样在 Markdown 中直接写 `<Button type="primary">` 就能实时渲染组件！

## 6.5 启动和构建

```bash
# 开发模式（热更新）
pnpm docs
# 等价于：pnpm --filter @my-lib/docs dev

# 构建生产静态文件
pnpm build:docs

# 本地预览构建产物
pnpm --filter @my-lib/docs preview
```

## 6.6 部署到 GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @my-lib/docs build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: packages/docs/docs/.vitepress/dist
```

## 6.7 部署到 Vercel / Netlify

都是零配置：
1. 连接 GitHub 仓库
2. Framework Preset 选 Vite
3. Build Command：`pnpm --filter @my-lib/docs build`
4. Output Directory：`packages/docs/docs/.vitepress/dist`
