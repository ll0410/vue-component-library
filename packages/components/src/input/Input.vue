<template>
  <div class="ml-input" :class="[`ml-input--${size}`, { 'ml-input--disabled': disabled }]">
    <span v-if="$slots.prefix" class="ml-input__prefix">
      <slot name="prefix" />
    </span>
    <input
      ref="inputRef"
      class="ml-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span v-if="showClear" class="ml-input__clear" @click="handleClear">&times;</span>
    <span v-if="$slots.suffix" class="ml-input__suffix">
      <slot name="suffix" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

export type InputSize = 'large' | 'medium' | 'small';
export type InputType = 'text' | 'password' | 'number' | 'email';

interface Props {
  /** 绑定值（支持 v-model） */
  modelValue?: string | number;
  /** 占位提示 */
  placeholder?: string;
  /** 原生 input 类型 */
  type?: InputType;
  /** 输入框尺寸 */
  size?: InputSize;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否可一键清空 */
  clearable?: boolean;
  /** 最大输入长度 */
  maxlength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  clearable: false
});

const emit = defineEmits<{
  /** v-model 更新 */
  (e: 'update:modelValue', value: string): void;
  /** 值变更（原生 change 触发） */
  (e: 'change', value: string): void;
  /** 获得焦点 */
  (e: 'focus', event: FocusEvent): void;
  /** 失去焦点 */
  (e: 'blur', event: FocusEvent): void;
  /** 点击清空 */
  (e: 'clear'): void;
}>();

const inputRef = ref<HTMLInputElement>();

/** 当前值是否为空 */
const isEmpty = computed(
  () => props.modelValue === '' || props.modelValue === undefined || props.modelValue === null
);

/** 是否展示清空按钮 */
const showClear = computed(
  () => props.clearable && !props.disabled && !props.readonly && !isEmpty.value
);

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};

const handleChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement).value);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  inputRef.value?.focus();
};

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
});
</script>

<style scoped>
/* 样式见 src/styles/input.css，此处仅保留必要的布局兜底 */
.ml-input {
  display: inline-flex;
}
</style>
