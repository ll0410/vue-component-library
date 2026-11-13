---
title: Dialog 对话框
---

# Dialog 对话框

在浮层中承载内容，常用于提示、表单、确认操作。

<script setup>
import { ref } from 'vue'

const basic = ref(false)
const withFooter = ref(false)
const customHeader = ref(false)
</script>

## 基础用法

通过 `v-model` 控制显隐，点击遮罩、关闭按钮或按 `Esc` 均可关闭。

<div class="demo-row">
  <Button type="primary" @click="basic = true">打开对话框</Button>
</div>

<Dialog v-model="basic" title="提示">
  <p>这是一段对话框的内容，点击遮罩或右上角关闭。</p>
</Dialog>

```vue
<script setup>
import { ref } from 'vue';
const visible = ref(false);
</script>

<template>
  <Button type="primary" @click="visible = true">打开对话框</Button>
  <Dialog v-model="visible" title="提示">
    <p>这是一段对话框的内容。</p>
  </Dialog>
</template>
```

## 带底部操作按钮

通过 `#footer` 插槽自定义底部区域。

<div class="demo-row">
  <Button type="primary" @click="withFooter = true">确认删除</Button>
</div>

<Dialog v-model="withFooter" title="确认删除">
  <p>删除后数据将无法恢复，确定继续吗？</p>
  <template #footer>
    <Button size="small" @click="withFooter = false">取消</Button>
    <Button size="small" type="danger" @click="withFooter = false">确定</Button>
  </template>
</Dialog>

```vue
<Dialog v-model="visible" title="确认删除">
  <p>删除后数据将无法恢复，确定继续吗？</p>
  <template #footer>
    <Button size="small" @click="visible = false">取消</Button>
    <Button size="small" type="danger" @click="visible = false">确定</Button>
  </template>
</Dialog>
```

## 自定义头部

通过 `#header` 插槽替换默认标题区域。

<div class="demo-row">
  <Button type="primary" @click="customHeader = true">自定义头部</Button>
</div>

<Dialog v-model="customHeader">
  <template #header>
    <span style="color: #409eff; font-weight: 600;">自定义标题区域</span>
  </template>
  <p>头部插槽可以完全替换默认标题。</p>
</Dialog>

```vue
<Dialog v-model="visible">
  <template #header>
    <span style="color: #409eff;">自定义标题区域</span>
  </template>
  <p>内容</p>
</Dialog>
```

## 点击遮罩不关闭

设置 `close-on-click-modal="false"`，只允许通过关闭按钮或 Esc 关闭。

```vue
<Dialog v-model="visible" title="强制操作" :close-on-click-modal="false">
  <p>必须点击右上角关闭按钮才能关闭。</p>
</Dialog>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 是否显示（支持 v-model） |
| title | `string` | `''` | 标题 |
| width | `string` | `'480px'` | 宽度 |
| showClose | `boolean` | `true` | 是否显示关闭按钮 |
| closeOnClickModal | `boolean` | `true` | 点击遮罩是否关闭 |
| appendToBody | `boolean` | `true` | 是否 Teleport 到 body |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `boolean` | 显隐变化（v-model） |
| open | — | 打开时触发 |
| close | — | 关闭时触发 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 对话框正文 |
| header | 自定义头部 |
| footer | 底部操作区域（不提供则不渲染） |

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  margin: 12px 0 20px;
}
</style>
