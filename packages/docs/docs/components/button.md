---
title: Button 按钮
---

# Button 按钮

常用的操作按钮。

## 基础用法

最基础的按钮用法，通过 `type` 设置不同类型。

<div style="display: flex; gap: 12px; flex-wrap: wrap;">
  <button class="ml-btn ml-btn--default ml-btn--medium">Default</button>
  <button class="ml-btn ml-btn--primary ml-btn--medium">Primary</button>
  <button class="ml-btn ml-btn--success ml-btn--medium">Success</button>
  <button class="ml-btn ml-btn--warning ml-btn--medium">Warning</button>
  <button class="ml-btn ml-btn--danger ml-btn--medium">Danger</button>
  <button class="ml-btn ml-btn--info ml-btn--medium">Info</button>
</div>

```vue
<Button type="default">Default</Button>
<Button type="primary">Primary</Button>
<Button type="success">Success</Button>
<Button type="warning">Warning</Button>
<Button type="danger">Danger</Button>
<Button type="info">Info</Button>
```

## 不同尺寸

通过 `size` 设置大、中、小三种尺寸。

<div style="display: flex; gap: 12px; align-items: center;">
  <button class="ml-btn ml-btn--primary ml-btn--large">Large</button>
  <button class="ml-btn ml-btn--primary ml-btn--medium">Medium</button>
  <button class="ml-btn ml-btn--primary ml-btn--small">Small</button>
</div>

```vue
<Button type="primary" size="large">Large</Button>
<Button type="primary" size="medium">Medium</Button>
<Button type="primary" size="small">Small</Button>
```

## 禁用状态

通过 `disabled` 设置禁用状态。

<div style="display: flex; gap: 12px;">
  <button class="ml-btn ml-btn--primary ml-btn--medium ml-btn--disabled">Disabled</button>
  <button class="ml-btn ml-btn--success ml-btn--medium ml-btn--disabled">Disabled</button>
</div>

```vue
<Button type="primary" disabled>Disabled</Button>
<Button type="success" disabled>Disabled</Button>
```

## Loading 状态

点击按钮后执行异步操作时，建议使用 `loading` 状态。

<div style="display: flex; gap: 12px;">
  <button class="ml-btn ml-btn--primary ml-btn--medium ml-btn--loading">
    <span class="ml-btn__loading"><span class="ml-btn__spinner"></span></span>
    Loading...
  </button>
</div>

```vue
<Button type="primary" loading>Loading...</Button>
```

## 圆角按钮

通过 `round` 设置圆角按钮。

<div style="display: flex; gap: 12px;">
  <button class="ml-btn ml-btn--primary ml-btn--medium ml-btn--round">Round</button>
  <button class="ml-btn ml-btn--success ml-btn--medium ml-btn--round">Round</button>
</div>

```vue
<Button type="primary" round>Round</Button>
<Button type="success" round>Round</Button>
```

## 朴素按钮

通过 `plain` 设置朴素按钮（浅背景 + 有边框）。

<div style="display: flex; gap: 12px; flex-wrap: wrap;">
  <button class="ml-btn ml-btn--plain ml-btn--primary ml-btn--medium">Primary</button>
  <button class="ml-btn ml-btn--plain ml-btn--success ml-btn--medium">Success</button>
  <button class="ml-btn ml-btn--plain ml-btn--warning ml-btn--medium">Warning</button>
  <button class="ml-btn ml-btn--plain ml-btn--danger ml-btn--medium">Danger</button>
</div>

```vue
<Button type="primary" plain>Primary</Button>
<Button type="success" plain>Success</Button>
<Button type="warning" plain>Warning</Button>
<Button type="danger" plain>Danger</Button>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'default'` | `'default'` | 按钮类型 |
| size | `'large' \| 'medium' \| 'small'` | `'medium'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 加载状态（带 spinner） |
| round | `boolean` | `false` | 圆角按钮 |
| plain | `boolean` | `false` | 朴素按钮 |
| htmlType | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 button 的 type 属性 |

## Events

| 事件名 | 参数 | 触发条件 |
|--------|------|---------|
| click | `MouseEvent` | 点击且非 disabled/loading 状态 |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 按钮内容 |

## 源码

- [Button.vue](https://github.com/)
- [Button.stories.ts](https://github.com/)
- [Button.spec.ts](https://github.com/)
