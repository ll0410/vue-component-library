# Storybook 组件开发

> Storybook 让你在**隔离环境**中开发、预览、调试每一个组件。

## 4.1 为什么用 Storybook？

| 痛点 | Storybook 解决 |
|------|---------------|
| 启动整个应用才能看一个组件 | 独立启动，秒级热更新 |
| 难以重现边界 case（loading/error/empty） | 每个 case 是一个 Story，一键切换 |
| 组件 props 变化难以追踪 | Controls 面板实时调参，所见即所得 |
| 缺少可视化文档 | Autodocs 自动从组件注释生成文档 |

## 4.2 安装与配置

### 安装

```bash
cd packages/components
pnpm add -D storybook @storybook/vue3 @storybook/vue3-vite
```

### .storybook/main.ts

```ts
import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [],  // Storybook 10 把常用 addon 内置了
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  docs: { autodocs: 'tag' }
};

export default config;
```

> 💡 Storybook 10 开始，autodocs 和 essentials 都内置了，不需要单独安装 addon 包。

### .storybook/preview.ts

```ts
import type { Preview } from '@storybook/vue3';

const withContainer = (storyFn: () => any) => ({
  components: { story: storyFn() },
  template: '<div style="padding: 24px;">\n    <story />\n  </div>'
});

const preview: Preview = {
  decorators: [withContainer],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: { color: /(background|color)$/i }
    }
  }
};

export default preview;
```

## 4.3 启动 Storybook

```bash
# 开发模式
pnpm storybook

# 构建静态版（可部署）
pnpm build-storybook
```

启动后访问 http://127.0.0.1:6006

## 4.4 Stories 编写规范

### 基础结构

```ts
import type { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';
import './style.css';

// 组件级元数据
const meta: Meta<typeof Button> = {
  title: 'Components/Button',     // 侧边栏层级
  component: Button,
  tags: ['autodocs'],              // 自动生成文档
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'danger', 'info', 'default'],
      description: '按钮类型'
    },
    onClick: { action: 'clicked' }
  },
  args: { type: 'primary', size: 'medium' }  // 默认 props
};

export default meta;
type Story = StoryObj<typeof Button>;

// 单个 Story
export const Basic: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args }; },
    template: '<Button v-bind="args">按钮</Button>'
  })
};
```

### 多场景展示

```ts
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
```

### 交互模式（Play 函数）

```ts
/** 点击后改变状态 */
export const WithInteraction: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      const count = ref(0);
      return { args, count };
    },
    template: `
      <Button v-bind="args" @click="count++">Clicked {{ count }} times</Button>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button');
    await expect(btn).toHaveTextContent('Clicked 0 times');
    await userEvent.click(btn);
    await expect(btn).toHaveTextContent('Clicked 1 times');
  }
};
```

## 4.5 Controls 面板

启动 Storybook 后，侧边栏的 Controls 面板可以实时调整 props：

```
┌─ Controls ──────────────────────┐
│ type      │ ▼ primary            │
│ size      │ ▼ medium             │
│ disabled  │ ☑                    │
│ loading   │ ☐                    │
│ round     │ ☐                    │
└──────────────────────────────────┘
```

**argTypes 配置类型**：

```ts
argTypes: {
  // select 下拉
  type: { control: 'select', options: ['a', 'b'] },
  // radio 单选
  size: { control: 'radio', options: ['s', 'm', 'l'] },
  // boolean 开关
  disabled: { control: 'boolean' },
  // color 选色器
  color: { control: 'color' },
  // 隐藏某个 prop
  onClick: { control: false }
}
```

## 4.6 全局配置

### decorators：给所有 Story 包裹一层

```ts
// .storybook/preview.ts
const withDarkMode = (storyFn) => ({
  components: { story: storyFn() },
  template: '<div style="background: #1a1a1a; padding: 24px;">\n    <story />\n  </div>'
});

const preview: Preview = {
  decorators: [withContainer, withDarkMode]
};
```

### parameters：全局参数

```ts
parameters: {
  // 禁用背景切换
  backgrounds: { disable: true },
  // 设置默认背景色
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1a1a1a' }
    ]
  },
  // 设置 viewport
  viewport: {
    defaultViewport: 'mobile'
  }
}
```

## 4.7 Autodocs 自动文档

```ts
const meta: Meta<typeof Button> = {
  tags: ['autodocs'],  // ✅ 加上这个标签
  component: Button
};
```

Storybook 会自动从组件中提取：
- Props 定义（包括类型和默认值）
- JSDoc 注释（description）
- Events（defineEmits）
- Slots
- 每个 Story 的 argTypes
