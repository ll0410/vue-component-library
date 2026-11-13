<template>
  <div ref="rootRef" class="ml-select" :class="[`ml-select--${size}`, { 'ml-select--disabled': disabled }]">
    <div
      class="ml-select__inner"
      :class="{ 'is-focus': visible }"
      role="button"
      tabindex="0"
      :aria-expanded="visible"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span v-if="selectedLabel" class="ml-select__label">{{ selectedLabel }}</span>
      <span v-else class="ml-select__placeholder">{{ placeholder }}</span>

      <span v-if="showClear" class="ml-select__clear" @click.stop="handleClear">&times;</span>
      <span v-else class="ml-select__caret" :class="{ 'is-reverse': visible }" />
    </div>

    <ul v-show="visible" class="ml-select__dropdown">
      <li
        v-for="item in options"
        :key="item.value"
        class="ml-select__option"
        :class="{
          'is-selected': item.value === modelValue,
          'is-disabled': item.disabled
        }"
        @click.stop="handleSelect(item)"
      >
        {{ item.label }}
      </li>
      <li v-if="!options.length" class="ml-select__empty">{{ emptyText }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type SelectSize = 'large' | 'medium' | 'small';
export type SelectValue = string | number;

export interface SelectOption {
  /** 选项显示文本 */
  label: string;
  /** 选项值 */
  value: SelectValue;
  /** 是否禁用该选项 */
  disabled?: boolean;
}

interface Props {
  /** 绑定值（支持 v-model） */
  modelValue?: SelectValue;
  /** 选项列表 */
  options?: SelectOption[];
  /** 占位提示 */
  placeholder?: string;
  /** 尺寸 */
  size?: SelectSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 无选项时的文案 */
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  placeholder: '请选择',
  size: 'medium',
  disabled: false,
  clearable: false,
  emptyText: '暂无数据'
});

const emit = defineEmits<{
  /** v-model 更新 */
  (e: 'update:modelValue', value: SelectValue | undefined): void;
  /** 选中项变化 */
  (e: 'change', value: SelectValue | undefined): void;
  /** 下拉框显隐变化 */
  (e: 'visible-change', visible: boolean): void;
  /** 点击清空 */
  (e: 'clear'): void;
}>();

const rootRef = ref<HTMLElement>();
const visible = ref(false);

/** 当前选中项的显示文本 */
const selectedLabel = computed(() => {
  const matched = props.options.find((item) => item.value === props.modelValue);
  return matched ? matched.label : '';
});

/** 是否展示清空按钮 */
const showClear = computed(
  () => props.clearable && !props.disabled && props.modelValue !== undefined && props.modelValue !== ''
);

const toggle = () => {
  if (props.disabled) return;
  visible.value = !visible.value;
};

const close = () => {
  visible.value = false;
};

const handleSelect = (item: SelectOption) => {
  if (item.disabled) return;
  emit('update:modelValue', item.value);
  emit('change', item.value);
  close();
};

const handleClear = () => {
  emit('update:modelValue', undefined);
  emit('change', undefined);
  emit('clear');
  close();
};

/** 点击组件外部时收起下拉 */
const handleDocumentClick = (event: MouseEvent) => {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(event.target as Node)) close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

watch(visible, (value) => {
  emit('visible-change', value);
});

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('keydown', handleKeydown);
});

defineExpose({ open: () => (visible.value = true), close });
</script>

<style scoped>
/* 样式见 src/styles/select.css */
.ml-select {
  position: relative;
  display: inline-block;
}
</style>
