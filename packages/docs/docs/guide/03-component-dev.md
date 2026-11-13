# 组件开发规范与流程

> 组件是组件库的核心，质量直接决定整个库的成败。

## 3.1 组件文件结构

每个组件一个独立目录：

```
button/
├── Button.vue          # 组件实现
├── Button.stories.ts   # Storybook stories（第 4 章详解）
├── Button.spec.ts      # 单元测试（第 5 章详解）
├── style.css           # 组件样式（可选，也可放共享 styles/ 目录）
└── index.ts            # 统一导出
```

## 3.2 Vite Library Mode 配置

组件包的 `vite.config.ts` 核心配置：

```ts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true, rollupTypes: true })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VCL',
      fileName: (format) => `index.${format === 'es' ? 'js' : format}`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue'],    // vue 不打进包里，用 peerDependencies
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'style.css'
      }
    }
  }
});
```

### 关键配置点

| 配置 | 作用 |
|------|------|
| `build.lib.entry` | 指定库入口 |
| `formats: ['es', 'cjs']` | 产出 ESM（现代构建工具）和 CJS（Node/旧工具） |
| `external: ['vue']` | Vue 作为 peer 依赖，不重复打包 |
| `vite-plugin-dts` | 构建时自动生成 `.d.ts` 类型声明文件 |

### 构建产物

```
dist/
├── index.js          ← ESM
├── index.cjs         ← CJS
├── index.d.ts        ← 类型声明
├── button/           ← 子组件类型声明
│   └── Button.vue.d.ts
└── style.css         ← 组件样式
```

## 3.3 package.json 发布关键字段

```json
{
  "name": "@vcl/components",
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
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "peerDependencies": {
    "vue": "^3.4.0"
  }
}
```

### 字段含义

- `main` / `module` / `types`：传统工具链识别的入口
- `exports`：Node 12+ 和现代构建工具的新标准，优先级最高
- `files`：发布到 npm 时只包含 `dist/`，减小包体积
- `sideEffects`：告诉 bundler CSS 有副作用，不要 tree-shake 掉
- `peerDependencies`：使用方必须自己安装 Vue，组件库不内置

## 3.4 组件编写规范

### Props 定义

```vue
<script setup lang="ts">
interface Props {
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  /** 按钮尺寸 */
  size?: 'large' | 'medium' | 'small';
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义文本颜色 */
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false
});
</script>
```

**规范要点**：
- ✅ 每个 prop 都有类型，使用联合类型限制取值
- ✅ 用 JSDoc `/** */` 标注 prop 含义（Storybook/docs 会自动提取）
- ✅ 必须有默认值，避免 undefined 导致运行时问题
- ❌ 避免 `any`，用 `unknown` 或泛型替代

### Emits 定义

```ts
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'change', value: string): void;
  (e: 'update:modelValue', value: string): void;  // v-model 支持
}>();
```

**规范要点**：
- ✅ Emits 名称用小写字母开头的驼峰
- ✅ 事件参数要有类型
- ✅ v-model 组件必须实现 `update:modelValue`

### Slots 使用

```vue
<template>
  <div class="ml-card">
    <div v-if="$slots.header" class="ml-card__header">
      <slot name="header" />
    </div>
    <div class="ml-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="ml-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### expose 暴露实例方法

```ts
// 需要父组件调用时
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
});
```

### BEM 类名命名规范

```
.ml-btn               ← block
.ml-btn--primary      ← block + modifier
.ml-btn__icon         ← block + element
.ml-btn__icon--left   ← block + element + modifier
```

统一前缀（如 `ml-`）避免与使用方样式冲突。

## 3.5 样式方案

推荐 **CSS Variables + 原生 CSS**（最轻量），也可根据团队习惯选 SCSS。

### CSS Variables 主题化

```css
/* 主题变量 */
:root {
  --ml-color-primary: #409eff;
  --ml-color-success: #67c23a;
  --ml-color-danger: #f56c6c;
  --ml-font-size-base: 14px;
  --ml-border-radius: 4px;
}

/* 组件使用 */
.ml-btn--primary {
  background-color: var(--ml-color-primary);
}
```

使用方可以覆盖变量实现主题切换：

```css
/* 暗色主题 */
html[data-theme="dark"] {
  --ml-color-primary: #337ecc;
}
```

## 3.6 组合式函数（Composables）

可复用的逻辑抽到独立的 composables 中：

```ts
// src/composables/useClickOutside.ts
import { onMounted, onBeforeUnmount } from 'vue';

export function useClickOutside(
  element: Ref<HTMLElement | null>,
  handler: (event: MouseEvent) => void
) {
  const listener = (event: MouseEvent) => {
    if (!element.value) return;
    if (!element.value.contains(event.target as Node)) {
      handler(event);
    }
  };

  onMounted(() => document.addEventListener('click', listener));
  onBeforeUnmount(() => document.removeEventListener('click', listener));
}
```
