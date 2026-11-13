# 单元测试策略

> 不写测试的组件库 = 不设防的城堡。

## 5.1 为什么用 Vitest？

| 特性 | Vitest | Jest |
|------|--------|------|
| 启动速度 | 毫秒级（基于 Vite） | 秒级 |
| TypeScript | 原生支持 | 需要 ts-jest |
| Vue SFC | 原生支持 | 需要 vue-jest |
| Watch 模式 | 极速 HMR 风格 | 重新编译 |
| 生态 | 与 Vue Test Utils 完美配合 | 成熟但老旧 |

**结论**：Vue 组件库首选 **Vitest + Vue Test Utils**。

## 5.2 安装与配置

### 安装

```bash
pnpm add -D vitest @vue/test-utils jsdom
```

### vitest 配置（已在 vite.config.ts 中）

```ts
// vite.config.ts
export default defineConfig({
  // ... build 配置
  test: {
    globals: true,           // 全局可用 describe/it/expect
    environment: 'jsdom',    // DOM 模拟环境
    coverage: {
      provider: 'v8',        // 覆盖率工具
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.d.ts']
    }
  }
});
```

### 为什么 `environment: 'jsdom'`？

组件测试需要 DOM 环境（元素、事件、计算样式）。`jsdom` 是纯 JS 实现的 DOM 环境，比无头浏览器快得多。

## 5.3 测试文件组织

与源码同目录，就近放置：

```
src/button/
├── Button.vue
├── Button.spec.ts    ← 紧跟组件
├── Button.stories.ts
└── index.ts
```

## 5.4 核心测试模式

### 模式一：渲染测试（最常用）

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button.vue', () => {
  it('正确渲染默认类型按钮', () => {
    const wrapper = mount(Button, { slots: { default: '按钮' } });
    expect(wrapper.text()).toBe('按钮');
    expect(wrapper.classes()).toContain('ml-btn--default');
  });
});
```

### 模式二：Props 响应测试

```ts
it('disabled 状态添加对应类名并设置原生属性', () => {
  const wrapper = mount(Button, { props: { disabled: true } });
  expect(wrapper.classes()).toContain('ml-btn--disabled');
  expect(wrapper.attributes('disabled')).toBeDefined();
});
```

### 模式三：事件触发测试

```ts
it('正常状态下触发 click 事件', async () => {
  const wrapper = mount(Button, { props: { type: 'primary' } });
  await wrapper.trigger('click');
  expect(wrapper.emitted('click')).toBeTruthy();
});

it('disabled 状态下不触发 click', async () => {
  const wrapper = mount(Button, { props: { disabled: true } });
  await wrapper.trigger('click');
  expect(wrapper.emitted('click')).toBeFalsy();
});
```

### 模式四：插槽测试

```ts
it('正确渲染具名插槽', () => {
  const wrapper = mount(Card, {
    slots: { header: '<span class="custom">自定义标题</span>' }
  });
  expect(wrapper.find('.custom').exists()).toBe(true);
  expect(wrapper.text()).toContain('自定义标题');
});
```

### 模式五：v-model 测试

```ts
import { ref } from 'vue';

it('支持 v-model', async () => {
  const modelValue = ref('hello');
  const wrapper = mount(Input, {
    props: { modelValue: modelValue.value },
    emits: ['update:modelValue']
  });
  await wrapper.setValue('world');
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world']);
});
```

### 模式六：Expose 测试

```ts
it('通过 ref 调用组件暴露的方法', async () => {
  const wrapper = mount(Input, { attachTo: document.body });
  const vm = wrapper.vm as any;
  await vm.focus();
  expect(document.activeElement).toBe(wrapper.find('input').element);
  wrapper.unmount();
});
```

## 5.5 选择合适的挂载方式

```ts
// mount：完整挂载（包含子组件），适合大多数场景
mount(Component)

// shallowMount：浅挂载（子组件变成 stub），适合只测当前组件
shallowMount(Component)

// render：返回 HTML 字符串，适合快照测试
const html = renderToString(Component)
```

### mount 常用选项

```ts
mount(Component, {
  props: { type: 'primary' },        // 传入 props
  slots: { default: 'Hello' },        // 传入 slot
  global: {
    plugins: [VueRouter],              // 注册插件
    stubs: { Icon: true },             // stub 子组件
    provide: { theme: 'dark' }         // provide
  },
  attachTo: document.body              // 挂载到 DOM（测试 focus/事件）
});
```

## 5.6 测试覆盖率

```bash
# 运行测试并生成覆盖率报告
pnpm test -- --coverage
```

建议目标：
- 核心工具函数：**95%+**
- 公共组件：**80%+**
- 内部实现细节：**不追覆盖率**（关注行为而非实现）

### 覆盖率报告

```
% Stmts % Branch % Funcs % Lines
      92.31    85.71   100.00   90.91   src/button/Button.vue
     100.00   100.00   100.00  100.00   src/shared/utils.ts
```

## 5.7 测试最佳实践

✅ **Do**
- 测试组件的**行为**（用户能看到什么、能做什么）
- 使用 `mount` + 真实渲染，避免过度 stub
- 每个测试聚焦一个场景
- 异步操作用 `await`

❌ **Don't**
- 测试组件的内部实现细节（私有变量、函数调用顺序）
- 过度使用 `shallowMount` 导致测试形同虚设
- 写脆弱的快照测试（HTML 结构一变就挂）
- 在测试中引入业务逻辑
