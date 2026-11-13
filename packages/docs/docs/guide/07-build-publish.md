# 构建与 npm 发布

> 组件库最终要让别人能 `npm install` 用起来，这一章讲完整的发布流程。

## 7.1 构建产物回顾

```bash
pnpm build:components
# 输出到 packages/components/dist/
```

产物清单：
- `index.js` — ESM 格式（import 语法）
- `index.cjs` — CJS 格式（require 语法）
- `index.d.ts` — TypeScript 类型声明
- `button/Button.vue.d.ts` — 子组件类型
- `style.css` — 组件样式

## 7.2 发布前检查清单

```bash
# 1. 所有测试通过
pnpm test:components

# 2. TypeScript 类型检查
pnpm --filter @vcl/components exec vue-tsc --noEmit

# 3. ESLint 检查
pnpm lint

# 4. 构建成功
pnpm build:components

# 5. 检查产物内容
ls -la packages/components/dist/

# 6. 预览要发布的内容
cd packages/components
npm pack --dry-run
```

## 7.3 package.json 发布配置

```json
{
  "name": "@vcl/components",
  "version": "0.0.1",
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### `files` 字段为什么重要？

```json
"files": ["dist"]
```

发布到 npm 时，**只**把 `dist/` 目录打进去。否则整个源码、测试、stories 都会被发布，包体积会膨胀几倍。

### `publishConfig.access`

- `"public"` — 发布到公共 npm（默认是 scoped 包会被拒绝）
- `"restricted"` — 发布到私有 registry

## 7.4 Changesets 版本管理

### 为什么不用 `npm version`？

Monorepo 中有多个包，手动协调版本号容易漏。Changesets 自动管理。

### 基本流程

```bash
# 1. 添加一个 changeset（交互式选择包和版本）
pnpm changeset

# 输出：.changeset/abc123.md
# ---
# '@vcl/components': minor
# ---
#
# 添加了 Button 组件
```

### 版本号规则

| changeset 选择 | 包版本变化 | 语义 |
|---------------|-----------|------|
| `patch` | 0.0.1 → 0.0.2 | bug 修复，向后兼容 |
| `minor` | 0.0.1 → 0.1.0 | 新功能，向后兼容 |
| `major` | 0.0.1 → 1.0.0 | 破坏性变更 |

### 应用 changeset

```bash
# 把 changeset 里的版本变更应用到 package.json
pnpm version
# 自动：
# - 更新相关包的 version
# - 更新 CHANGELOG.md
# - 删除已应用的 changeset 文件
# - 更新 pnpm-lock.yaml
```

### 发布

```bash
# 登录 npm（只需要一次）
npm login

# 发布所有有版本变更的包
pnpm release
# 等价于：changeset publish
```

## 7.5 完整发布流程（串起来）

```bash
# 开发者日常流程

# 1. 开发 + 测试
pnpm test:components
pnpm build:components

# 2. 写 changeset
pnpm changeset        # 交互式选择

# 3. 提交（包含 .changeset/*.md）
git add .
git commit -m "feat(components): add Button component"

# 4. PR 合入 main 后，执行发布
pnpm version          # 应用版本号
git add .
git commit -m "chore: release v0.1.0"
git tag v0.1.0
git push && git push --tags

# 5. 发布到 npm
pnpm release
```

## 7.6 CI/CD 自动化发布

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    # 只在有 changeset 的 push 时执行
    if: contains(github.event.head_commit.message, 'chore: release')
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }  # 需要完整历史打 tag
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, registry-url: 'https://registry.npmjs.org' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:components
      - run: pnpm build:components
      - run: pnpm release
        env: { NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} }
```

## 7.7 用户使用方式

发布后，别人这样用：

```bash
npm install @vcl/components
# 或
pnpm add @vcl/components
```

```ts
// main.ts
import { createApp } from 'vue';
import { Button } from '@vcl/components';
import '@vcl/components/style.css';
import App from './App.vue';

const app = createApp(App);
app.component('Button', Button);  // 或直接用
app.mount('#app');
```

```vue
<!-- App.vue -->
<template>
  <Button type="primary" @click="handleClick">点我</Button>
</template>
```

## 7.8 常见问题

| 问题 | 解决 |
|------|------|
| `npm ERR! 402 Payment Required` | scoped 包（@xxx/yyy）发布到公共 registry 需要 `publishConfig.access: public` |
| 用户报 `Cannot find module 'vue'` | 确认 `peerDependencies` 包含 vue，用户需自己安装 |
| 类型声明找不到 | 检查 `vite-plugin-dts` 是否正确配置，`build` 是否包含 dts 生成 |
| 样式没生效 | 用户需要单独 `import '@vcl/components/style.css'` |
