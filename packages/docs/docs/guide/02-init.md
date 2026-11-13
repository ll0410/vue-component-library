# Monorepo 项目初始化

> 本章带你从零搭好组件库的工程骨架，包含所有配置文件。

## 2.1 创建根目录结构

```bash
# 初始化 Git
git init vue-component-library
cd vue-component-library

# 创建目录结构
mkdir -p packages/components/src
mkdir -p packages/docs/docs
mkdir -p .changeset
```

## 2.2 pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

> 这行配置告诉 pnpm：`packages/` 下所有子目录都是独立的 workspace 包。

## 2.3 根 package.json

```json
{
  "name": "vue-component-library",
  "private": true,
  "version": "0.0.1",
  "packageManager": "pnpm@10.34.9",
  "engines": { "node": ">=18.0.0" },
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --filter=./packages/* build",
    "build:components": "pnpm --filter @vcl/components build",
    "test": "pnpm -r --parallel test",
    "lint": "eslint . --ext .ts,.vue,.cjs --fix",
    "storybook": "pnpm --filter @vcl/components storybook",
    "docs": "pnpm --filter @vcl/docs dev",
    "changeset": "changeset",
    "release": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^3.0.0",
    "@types/node": "^22.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "prettier": "^3.4.0",
    "typescript": "^5.7.0",
    "vue-eslint-parser": "^9.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

### pnpm 关键脚本说明

| 命令 | 含义 |
|------|------|
| `pnpm -r --parallel dev` | 递归并行运行所有包的 dev 脚本 |
| `pnpm --filter @vcl/components build` | 只构建指定包 |
| `pnpm -r --filter=./packages/* build` | 构建所有 packages/ 下的包 |

### filter 语法速查

```bash
pnpm --filter @vcl/components build   # 按包名
pnpm --filter ./packages/components build  # 按路径
pnpm -r --filter=!@vcl/docs build    # 排除某个包
```

## 2.4 .npmrc

```ini
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
```

- `shamefully-hoist=false`：保持 pnpm 严格隔离特性
- `auto-install-peers=true`：自动安装 peer 依赖，减少手动操作

## 2.5 共享 tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "baseUrl": ".",
    "paths": {
      "@vcl/*": ["packages/*/src"]
    }
  }
}
```

### 为什么 `moduleResolution: "Bundler"`？

Vite / Vitest / VitePress 都使用基于 ESM 的模块解析策略，`Bundler` 模式是 TypeScript 5 专门为此设计的，允许你在 `import` 时省略 `.js` 后缀。

## 2.6 ESLint 配置

```js
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  }
};
```

### 关键点

- 必须用 `vue-eslint-parser` 作为外层 parser，才能解析 `.vue` 文件
- 内层 parser 是 `@typescript-eslint/parser`，负责 `<script lang="ts">` 块
- `prettier` 放在最后，关闭与 Prettier 冲突的规则

## 2.7 Prettier 配置

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "tabWidth": 2
}
```

## 2.8 .gitignore

```gitignore
node_modules
dist
*.local
*.tsbuildinfo
.env
.env.local
.DS_Store
.vscode/*
!.vscode/extensions.json
```

## 2.9 安装依赖

```bash
pnpm install
```

首次安装 pnpm 会自动：
1. 读取所有 `package.json`
2. 解析依赖树
3. 在根目录生成 `pnpm-lock.yaml`
4. 创建各包的 `node_modules`（通过符号链接关联到 `.pnpm` store）

### 安装后目录结构

```
vue-component-library/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── node_modules/            ← 根 node_modules（少）
├── packages/
│   ├── components/
│   │   ├── package.json
│   │   └── node_modules/    ← 组件包的依赖
│   └── docs/
│       ├── package.json
│       └── node_modules/   ← 文档站的依赖
└── .changeset/
    └── config.json
```

## 2.10 快速验证

```bash
# 查看 workspace 中有哪些包
pnpm ls -r --depth -1

# 预期输出：
# @vcl/components@0.0.1
# @vcl/docs@0.0.1
```
