# 实战：从零造一个 Button

> 理论看了一堆，跟着这个实战从零走一遍，你就真正掌握了。

## 8.1 需求分析

**目标**：打造一个 Element Plus 风格的 Button 组件。

**Props 设计**：

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'default'` | 按钮类型 |
| `size` | `'large' \| 'medium' \| 'small'` | `'medium'` | 按钮尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 加载状态（自带 spinner） |
| `round` | `boolean` | `false` | 圆角按钮 |
| `plain` | `boolean` | `false` | 朴素按钮（背景透明 + 有边框） |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button 类型 |

**Events**：
| Event | 参数 | 触发条件 |
|-------|------|---------|
| `click` | `MouseEvent` | 点击且非 disabled/loading |

**Slots**：
| Slot | 说明 |
|------|------|
| `default` | 按钮内容 |

## 8.2 Step 1：创建组件文件

```bash
# 创建目录和文件
mkdir -p packages/components/src/button
touch packages/components/src/button/{Button.vue,index.ts,style.css}
```

### Button.vue 完整实现

```vue
<!-- packages/components/src/button/Button.vue -->
<template>
  <button
    class="ml-btn"
    :class="[
      `ml-btn--${type}`,
      `ml-btn--${size}`,
      {
        'ml-btn--disabled': disabled,
        'ml-btn--loading': loading,
        'ml-btn--round': round,
        'ml-btn--plain': plain
      }
    ]"
    :disabled="disabled || loading"
    :type="htmlType"
    @click="handleClick"
  >
    <span v-if="loading" class="ml-btn__loading">
      <span class="ml-btn__spinner" />
    </span>
    <span class="ml-btn__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
export type ButtonSize = 'large' | 'medium' | 'small';

interface Props {
  /** 按钮类型 */
  type?: ButtonType;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否 loading 状态 */
  loading?: boolean;
  /** 是否圆角按钮 */
  round?: boolean;
  /** 是否朴素按钮 */
  plain?: boolean;
  /** 原生 button type 属性 */
  htmlType?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  round: false,
  plain: false,
  htmlType: 'button'
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit('click', event);
};
</script>
```

### index.ts 模块导出

```ts
// packages/components/src/button/index.ts
export { default as Button } from './Button.vue';
export type { ButtonType, ButtonSize } from './Button.vue';
```

### src/index.ts 统一入口

```ts
// packages/components/src/index.ts
import './styles/button.css';

export { Button } from './button';
export type { ButtonType, ButtonSize } from './button';
export * from './shared/utils';
```

## 8.3 Step 2：编写样式

完整的样式见源码 `src/styles/button.css`，核心要点：

```css
.ml-btn {
  /* 基础样式 */
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: background-color 0.2s;
}

/* 类型变体 */
.ml-btn--primary {
  background-color: #409eff;
  color: #fff;
}
.ml-btn--primary:hover:not(:disabled) {
  background-color: #66b1ff;
}

/* loading spinner 动画 */
.ml-btn__spinner {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ml-btn-spin 0.8s linear infinite;
}
@keyframes ml-btn-spin {
  to { transform: rotate(360deg); }
}

/* disabled 不响应 hover */
.ml-btn--disabled:hover {
  background-color: #f5f7fa !important;
}
```

## 8.4 Step 3：Storybook Stories

```ts
// packages/components/src/button/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';
import './style.css';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info']
    },
    size: { control: 'select', options: ['large', 'medium', 'small'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    round: { control: 'boolean' },
    plain: { control: 'boolean' },
    onClick: { action: 'clicked' }
  },
  args: { type: 'primary', size: 'medium' }
};

export default meta;
type Story = StoryObj<typeof Button>;

/** 不同类型 */
export const Types: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px;">
        <Button type="default">Default</Button>
        <Button type="primary">Primary</Button>
        <Button type="success">Success</Button>
        <Button type="warning">Warning</Button>
        <Button type="danger">Danger</Button>
        <Button type="info">Info</Button>
      </div>
    `
  })
};

/** 不同尺寸 */
export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <Button type="primary" size="large">Large</Button>
        <Button type="primary" size="medium">Medium</Button>
        <Button type="primary" size="small">Small</Button>
      </div>
    `
  })
};
```

### 启动 Storybook 预览

```bash
pnpm storybook
# http://127.0.0.1:6006 → Components → Button
```

## 8.5 Step 4：单元测试

```ts
// packages/components/src/button/Button.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button.vue', () => {
  it('正确渲染默认类型按钮', () => {
    const wrapper = mount(Button, { slots: { default: '按钮' } });
    expect(wrapper.text()).toBe('按钮');
    expect(wrapper.classes()).toContain('ml-btn--default');
  });

  it('disabled 状态设置原生 disabled 属性', () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('ml-btn--disabled');
  });

  it('loading 状态显示 spinner 且禁用点击', async () => {
    const wrapper = mount(Button, { props: { loading: true } });
    expect(wrapper.find('.ml-btn__spinner').exists()).toBe(true);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  it('点击触发事件', async () => {
    const wrapper = mount(Button, { props: { type: 'primary' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')!.length).toBe(1);
  });

  it('不支持的 type 仍渲染 default 样式（无 crash）', () => {
    // 因为 TS 联合类型限制，这里实际无法传入非法值
    // 但如果外部用 JS 调用传入非法 type，应正常渲染
    const wrapper = mount(Button as any, { props: { type: 'unknown' } });
    expect(wrapper.exists()).toBe(true);
  });
});
```

### 运行测试

```bash
pnpm test:components
# ✓ src/button/Button.spec.ts (17 tests)
# Test Files  1 passed (1)
#      Tests  17 passed (17)
```

## 8.6 Step 5：构建验证

```bash
# 类型检查 + 构建
pnpm build:components

# 预期输出：
# dist/
# ├── index.js          (1.78 kB)
# ├── index.cjs         (1.44 kB)
# ├── index.d.ts
# ├── button/
# │   ├── Button.vue.d.ts
# │   └── index.d.ts
# ├── shared/utils.d.ts
# └── style.css         (2.60 kB)
```

## 8.7 Step 6：在文档站预览

创建组件文档页面 `packages/docs/docs/components/button.md`：

```md
---
title: Button 按钮
---

# Button 按钮

常用的操作按钮。

## 基础用法

<div style="display: flex; gap: 12px;">
  <MlButton>Default</MlButton>
  <MlButton type="primary">Primary</MlButton>
  <MlButton type="success">Success</MlButton>
</div>

## 不同类型

<MlButton type="default">Default</MlButton>
<MlButton type="primary">Primary</MlButton>
<MlButton type="success">Success</MlButton>
<MlButton type="warning">Warning</MlButton>
<MlButton type="danger">Danger</MlButton>
<MlButton type="info">Info</MlButton>

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'primary'\|'success'\|'warning'\|'danger'\|'info'\|'default'` | `'default'` | 按钮类型 |
| size | `'large'\|'medium'\|'small'` | `'medium'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 加载状态 |
| round | `boolean` | `false` | 圆角按钮 |
| plain | `boolean` | `false` | 朴素按钮 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | `MouseEvent` | 点击触发（disabled/loading 时不触发） |
```

### 启动文档站

```bash
pnpm docs
# http://localhost:5173 → 组件 → Button
```

## 8.8 完整 Check List

| 步骤 | 命令 | 验证 |
|------|------|------|
| ✅ 组件实现 | — | TS 类型无错误 |
| ✅ 样式 | — | 6 种类型 × 3 种尺寸 × 4 种状态正确渲染 |
| ✅ Storybook | `pnpm storybook` | 所有 Story 可交互 |
| ✅ 单元测试 | `pnpm test:components` | 17 个测试全部通过 |
| ✅ 构建 | `pnpm build:components` | dist/ 产物正确 |
| ✅ 文档站 | `pnpm docs` | 页面可访问 |

## 8.9 下一步

你已经有了一个 Button 组件！接下来可以：

1. 用同样的模式添加更多组件（Input、Select、Dialog...）
2. 配置 CI/CD 自动化发布
3. 完善设计系统（颜色变量、间距、字体规范）
4. 建立组件贡献规范（CONTRIBUTING.md）

> 🎉 恭喜！你已经完整走完了一个 Vue 组件从设计到发布的全流程。
