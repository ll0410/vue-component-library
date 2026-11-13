<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition name="ml-dialog-fade">
      <div v-if="modelValue" class="ml-dialog__wrapper" @click.self="handleWrapperClick">
        <div class="ml-dialog" :style="{ width }" role="dialog" aria-modal="true">
          <div class="ml-dialog__header">
            <slot name="header">
              <span class="ml-dialog__title">{{ title }}</span>
            </slot>
            <button v-if="showClose" class="ml-dialog__close" aria-label="close" @click="close">
              &times;
            </button>
          </div>

          <div class="ml-dialog__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="ml-dialog__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';

interface Props {
  /** 是否显示（支持 v-model） */
  modelValue?: boolean;
  /** 标题 */
  title?: string;
  /** 宽度 */
  width?: string;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 点击遮罩是否关闭 */
  closeOnClickModal?: boolean;
  /** 是否挂载到 body（关闭后仍保留 DOM 结构） */
  appendToBody?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: '480px',
  showClose: true,
  closeOnClickModal: true,
  appendToBody: true
});

const emit = defineEmits<{
  /** v-model 更新 */
  (e: 'update:modelValue', value: boolean): void;
  /** 打开时触发 */
  (e: 'open'): void;
  /** 关闭时触发 */
  (e: 'close'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};

const handleWrapperClick = () => {
  if (!props.closeOnClickModal) return;
  close();
};

/** Esc 关闭 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

watch(
  () => props.modelValue,
  (value) => {
    // SSR 环境（如文档站构建）没有 document，跳过事件绑定
    if (typeof document === 'undefined') return;

    if (value) {
      emit('open');
      document.addEventListener('keydown', handleKeydown);
    } else {
      emit('close');
      document.removeEventListener('keydown', handleKeydown);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return;
  document.removeEventListener('keydown', handleKeydown);
});

defineExpose({ close });
</script>

<style scoped>
/* 样式见 src/styles/dialog.css */
.ml-dialog {
  box-sizing: border-box;
}
</style>
