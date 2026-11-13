import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import Input from './Input.vue';
import '../styles/input.css';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
      description: '输入框尺寸'
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'password', 'number', 'email'],
      description: '原生 input 类型'
    },
    disabled: { control: 'boolean', description: '是否禁用' },
    readonly: { control: 'boolean', description: '是否只读' },
    clearable: { control: 'boolean', description: '是否可清空' },
    placeholder: { control: 'text', description: '占位提示' },
    maxlength: { control: 'number', description: '最大输入长度' },
    onUpdate: { action: 'update:modelValue', description: 'v-model 更新' },
    onChange: { action: 'change', description: '值变更' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    onClear: { action: 'clear' }
  },
  args: {
    placeholder: '请输入内容',
    size: 'medium',
    type: 'text',
    disabled: false,
    readonly: false,
    clearable: false
  }
};

export default meta;
type Story = StoryObj<typeof Input>;

/** 基础用法（支持 v-model） */
export const Basic: Story = {
  render: (args) => ({
    components: { Input },
    setup() {
      const value = ref('');
      return { args, value };
    },
    template: '<Input v-bind="args" v-model="value" style="width: 240px;" />'
  })
};

/** 不同尺寸 */
export const Sizes: Story = {
  render: () => ({
    components: { Input },
    setup() {
      return { large: ref(''), medium: ref(''), small: ref('') };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 240px;">
        <Input size="large" placeholder="Large" v-model="large" />
        <Input size="medium" placeholder="Medium" v-model="medium" />
        <Input size="small" placeholder="Small" v-model="small" />
      </div>
    `
  })
};

/** 可清空 */
export const Clearable: Story = {
  render: () => ({
    components: { Input },
    setup() {
      return { value: ref('点击右侧图标清空') };
    },
    template: '<Input v-model="value" clearable style="width: 240px;" />'
  })
};

/** 密码输入 */
export const Password: Story = {
  render: () => ({
    components: { Input },
    setup() {
      return { value: ref('') };
    },
    template: '<Input v-model="value" type="password" placeholder="请输入密码" style="width: 240px;" />'
  })
};

/** 禁用 / 只读 */
export const Disabled: Story = {
  render: () => ({
    components: { Input },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 240px;">
        <Input model-value="禁用状态" disabled />
        <Input model-value="只读状态" readonly />
      </div>
    `
  })
};

/** 前后缀插槽 */
export const WithSlots: Story = {
  render: () => ({
    components: { Input },
    setup() {
      return { value: ref('') };
    },
    template: `
      <Input v-model="value" placeholder="请输入金额" style="width: 240px;">
        <template #prefix>￥</template>
        <template #suffix>元</template>
      </Input>
    `
  })
};
