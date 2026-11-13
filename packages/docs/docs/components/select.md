---
title: Select 选择器
---

# Select 选择器

下拉选择组件，支持选项禁用、清空、点击外部收起。

<script setup>
import { ref } from 'vue'

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '西瓜（已售罄）', value: 'watermelon', disabled: true }
]

const basic = ref()
const clearable = ref('apple')
const large = ref()
const medium = ref()
const small = ref()
</script>

## 基础用法

<div class="demo-row">
  <Select v-model="basic" :options="options" placeholder="请选择水果" />
</div>

```vue
<script setup>
import { ref } from 'vue';
const value = ref();
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' }
];
</script>

<template>
  <Select v-model="value" :options="options" placeholder="请选择水果" />
</template>
```

## 可清空

<div class="demo-row">
  <Select v-model="clearable" :options="options" clearable />
</div>

```vue
<Select v-model="value" :options="options" clearable />
```

## 禁用选项

选项设置 `disabled: true` 后不可被选中。

<div class="demo-row">
  <Select v-model="basic" :options="options" placeholder="最后一项不可选" />
</div>

```js
const options = [
  { label: '西瓜', value: 'watermelon', disabled: true }
];
```

## 尺寸

<div class="demo-row">
  <Select v-model="large" :options="options" size="large" placeholder="Large" />
  <Select v-model="medium" :options="options" size="medium" placeholder="Medium" />
  <Select v-model="small" :options="options" size="small" placeholder="Small" />
</div>

```vue
<Select v-model="large" :options="options" size="large" />
<Select v-model="medium" :options="options" size="medium" />
<Select v-model="small" :options="options" size="small" />
```

## 禁用状态

<div class="demo-row">
  <Select :options="options" model-value="apple" disabled />
</div>

```vue
<Select :options="options" model-value="apple" disabled />
```

## 无数据

<div class="demo-row">
  <Select :options="[]" empty-text="没有匹配的选项" placeholder="暂无数据" />
</div>

```vue
<Select :options="[]" empty-text="没有匹配的选项" />
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string \| number` | — | 绑定值（支持 v-model） |
| options | `SelectOption[]` | `[]` | 选项列表 |
| placeholder | `string` | `'请选择'` | 占位提示 |
| size | `'large' \| 'medium' \| 'small'` | `'medium'` | 尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| clearable | `boolean` | `false` | 是否可清空 |
| emptyText | `string` | `'暂无数据'` | 无选项文案 |

### SelectOption

| 字段 | 类型 | 说明 |
|------|------|------|
| label | `string` | 显示文本 |
| value | `string \| number` | 选项值 |
| disabled | `boolean` | 是否禁用该选项 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `SelectValue \| undefined` | 选中或清空时触发（v-model） |
| change | `SelectValue \| undefined` | 选中项变化 |
| visible-change | `boolean` | 下拉框显隐变化 |
| clear | — | 点击清空 |

## Expose

| 方法 | 说明 |
|------|------|
| open() | 打开下拉面板 |
| close() | 收起下拉面板 |

<style scoped>
.demo-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0 20px;
  max-width: 320px;
}
</style>
