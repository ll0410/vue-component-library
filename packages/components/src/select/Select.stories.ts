import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import Select from './Select.vue';
import '../styles/select.css';

const fruitOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '西瓜（已售罄）', value: 'watermelon', disabled: true }
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
      description: '尺寸'
    },
    disabled: { control: 'boolean', description: '是否禁用' },
    clearable: { control: 'boolean', description: '是否可清空' },
    placeholder: { control: 'text', description: '占位提示' },
    emptyText: { control: 'text', description: '无选项文案' },
    onUpdate: { action: 'update:modelValue' },
    onChange: { action: 'change' },
    onVisibleChange: { action: 'visible-change' },
    onClear: { action: 'clear' }
  },
  args: {
    options: fruitOptions,
    placeholder: '请选择水果',
    size: 'medium',
    disabled: false,
    clearable: false
  }
};

export default meta;
type Story = StoryObj<typeof Select>;

/** 基础用法（支持 v-model） */
export const Basic: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const value = ref<string | number | undefined>(undefined);
      return { args, value };
    },
    template: '<Select v-bind="args" v-model="value" style="width: 240px;" />'
  })
};

/** 可清空 */
export const Clearable: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | number | undefined>('apple');
      return { value, options: fruitOptions };
    },
    template: '<Select v-model="value" :options="options" clearable style="width: 240px;" />'
  })
};

/** 不同尺寸 */
export const Sizes: Story = {
  render: () => ({
    components: { Select },
    setup() {
      return { large: ref(), medium: ref(), small: ref(), options: fruitOptions };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 240px;">
        <Select v-model="large" :options="options" size="large" />
        <Select v-model="medium" :options="options" size="medium" />
        <Select v-model="small" :options="options" size="small" />
      </div>
    `
  })
};

/** 含禁用选项 */
export const WithDisabledOption: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | number | undefined>(undefined);
      return { value, options: fruitOptions };
    },
    template: '<Select v-model="value" :options="options" style="width: 240px;" />'
  })
};

/** 禁用状态 */
export const Disabled: Story = {
  render: () => ({
    components: { Select },
    template: '<Select :options="[]" model-value="apple" disabled style="width: 240px;" />'
  })
};

/** 无数据 */
export const Empty: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const value = ref();
      return { value };
    },
    template: '<Select v-model="value" :options="[]" empty-text="没有匹配的选项" style="width: 240px;" />'
  })
};
