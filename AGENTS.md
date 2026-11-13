# Vue 组件库开发规范（AGENTS.md）

## 项目概述

这是一个基于 pnpm Monorepo 的 Vue 3 组件库项目，包含：
- `packages/components` — 核心组件库（对外发布）
- `packages/docs` — VitePress 文档站
- `.changeset/` — Changesets 版本管理

## 技术栈

| 领域 | 工具 |
|------|------|
| 框架 | Vue 3.5 + TypeScript 5 |
| 构建 | Vite 8 + vite-plugin-dts 5 |
| 组件开发 | Storybook 10 |
| 测试 | Vitest 5 + Vue Test Utils |
| 文档 | VitePress 1.5 |
| 版本管理 | Changesets 3 |
| 代码规范 | ESLint 9 + Prettier 3 + Stylelint 16 |

## 常用命令

```bash
pnpm install              # 安装所有依赖
pnpm build:components     # 构建组件库（TS 检查 + Vite 构建）
pnpm build:docs           # 构建文档站
pnpm test:components      # 运行单元测试
pnpm storybook            # 启动 Storybook 开发环境
pnpm docs                 # 启动 VitePress 文档站
pnpm changeset            # 添加版本变更记录
pnpm version              # 应用 changeset 到 package.json
pnpm release              # 发布到 npm
```

## Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>
```

### Type 列表

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构（非新功能、非修复） |
| `perf` | 性能优化 |
| `test` | 添加或修改测试 |
| `build` | 构建或外部依赖变更 |
| `ci` | CI 配置变更 |
| `chore` | 其他杂项 |
| `revert` | 回滚提交 |

### Scope 列表

| Scope | 说明 |
|-------|------|
| `components` | 组件包变更 |
| `docs` | 文档站变更 |
| `all` | 跨包变更 |
| 或具体组件名 | `button`、`input` 等 |

### 示例

```
feat(components): add Button component
fix(button): handle disabled click correctly
docs(guide): complete chapter 08 button example
refactor(button): extract styles to CSS variables
```

## 组件开发规范

- 每个组件一个独立目录：`src/{component-name}/`
- 目录内包含：`Component.vue`、`Component.stories.ts`、`Component.spec.ts`、`index.ts`
- 使用 BEM 命名：`.ml-btn` / `.ml-btn--primary` / `.ml-btn__icon`
- Props 必须有 TypeScript 类型定义和 JSDoc 注释
- 组件样式使用 CSS Variables 支持主题化
- 所有新组件必须编写 Storybook stories 和 Vitest 测试

## 目录结构

```
Vue Component Library/
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── packages/
│   ├── components/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── .storybook/
│   │   │   ├── main.ts
│   │   │   └── preview.ts
│   │   └── src/
│   │       ├── index.ts
│   │       ├── shims-vue.d.ts
│   │       ├── button/
│   │       │   ├── Button.vue
│   │       │   ├── Button.stories.ts
│   │       │   ├── Button.spec.ts
│   │       │   └── index.ts
│   │       ├── input/
│   │       │   ├── Input.vue
│   │       │   ├── Input.stories.ts
│   │       │   ├── Input.spec.ts
│   │       │   └── index.ts
│   │       ├── select/
│   │       │   ├── Select.vue
│   │       │   ├── Select.stories.ts
│   │       │   ├── Select.spec.ts
│   │       │   └── index.ts
│   │       ├── dialog/
│   │       │   ├── Dialog.vue
│   │       │   ├── Dialog.stories.ts
│   │       │   ├── Dialog.spec.ts
│   │       │   └── index.ts
│   │       ├── shared/utils.ts
│   │       └── styles/
│   │           ├── button.css
│   │           ├── input.css
│   │           ├── select.css
│   │           └── dialog.css
│   └── docs/
│       ├── package.json
│       └── docs/
│           ├── .vitepress/
│           │   ├── config.ts    # 站点配置（导航 / 侧边栏）
│           │   └── theme/       # 主题扩展（全局注册组件）
│           ├── index.md
│           ├── guide/        # 8 章开发指南
│           └── components/   # 组件文档
└── .changeset/
```
