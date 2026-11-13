---
title: Input 输入框
---

# Input 输入框

通过鼠标或键盘输入内容，支持 `v-model` 双向绑定。

<script setup>
import { ref } from 'vue'

const basic = ref('')
const clearable = ref('点击右侧图标清空')
const password = ref('')
const amount = ref('')
const disabledValue = ref('禁用状态')
</script>

## 基础用法

<div class="demo-row">
  <Input v-model="basic" placeholder="请输入内容" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const value = ref('');
</script>

<template>
  <Input v-model="value" placeholder="请输入内容" />
</template>
```

## 可清空

设置 `clearable` 后，有值时会展示清空图标。

<div class="demo-row">
  <Input v-model="clearable" clearable />
</div>

```vue
<Input v-model="value" clearable />
```

## 密码输入

通过 `type="password"` 切换为密码框。

<div class="demo-row">
  <Input v-model="password" type="password" placeholder="请输入密码" />
</div>

```vue
<Input v-model="value" type="password" placeholder="请输入密码" />
```

## 尺寸

提供 `large` / `medium` / `small` 三种尺寸。

<div class="demo-row">
  <Input size="large" placeholder="Large" />
  <Input size="medium" placeholder="Medium" />
  <Input size="small" placeholder="Small" />
</div>

```vue
<Input size="large" placeholder="Large" />
<Input size="medium" placeholder="Medium" />
<Input size="small" placeholder="Small" />
```

## 禁用与只读

<div class="demo-row">
  <Input v-model="disabledValue" disabled />
  <Input model-value="只读状态" readonly />
</div>

```vue
<Input model-value="禁用状态" disabled />
<Input model-value="只读状态" readonly />
```

## 前后缀插槽

通过 `#prefix` / `#suffix` 插槽自定义前后缀内容。

<div class="demo-row">
  <Input v-model="amount" placeholder="请输入金额">
    <template #prefix>￥</template>
    <template #suffix>元</template>
  </Input>
</div>

```vue
<Input v-model="value" placeholder="请输入金额">
  <template #prefix>￥</template>
  <template #suffix>元</template>
</Input>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number` | `''` | 绑定值（支持 v-model） |
| placeholder | `string` | `''` | 占位提示 |
| type | `'text' \| 'password' \| 'number' \| 'email'` | `'text'` | 原生 input 类型 |
| size | `'large' \| 'medium' \| 'small'` | `'medium'` | 尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| readonly | `boolean` | `false` | 是否只读 |
| clearable | `boolean` | `false` | 是否可一键清空 |
| maxlength | `number` | — | 最大输入长度 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `string` | 输入时触发（v-model） |
| change | `string` | 原生 change 触发 |
| focus | `FocusEvent` | 获得焦点 |
| blur | `FocusEvent` | 失去焦点 |
| clear | — | 点击清空按钮 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| prefix | 输入框前缀内容 |
| suffix | 输入框后缀内容 |

## Expose

| 方法 | 说明 |
|------|------|
| focus() | 使输入框聚焦 |
| blur() | 使输入框失焦 |
| select() | 选中输入框内文本 |

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 0 20px;
  max-width: 520px;
}
</style>
