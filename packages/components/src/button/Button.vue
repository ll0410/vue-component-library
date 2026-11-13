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
  /** 是否显示 loading 状态 */
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
  /** 点击事件（禁用/loading 状态下不触发） */
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return;
  emit('click', event);
};
</script>

<style scoped>
/* 注意：组件样式通过 src/styles/button.css 统一导出，此处仅作 scoped 占位 */
.ml-btn {
  cursor: pointer;
}
</style>
