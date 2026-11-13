import type { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';
import '../styles/button.css';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
      description: '按钮类型'
    },
    size: {
      control: { type: 'select' },
      options: ['large', 'medium', 'small'],
      description: '按钮尺寸'
    },
    disabled: { control: 'boolean', description: '是否禁用' },
    loading: { control: 'boolean', description: '是否 loading 状态' },
    round: { control: 'boolean', description: '是否圆角按钮' },
    plain: { control: 'boolean', description: '是否朴素按钮' },
    htmlType: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: '原生 button type'
    },
    onClick: { action: 'clicked', description: '点击事件' }
  },
  args: {
    type: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    round: false,
    plain: false
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

/** 基础用法 */
export const Basic: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">按钮</Button>'
  })
};

/** 不同类型 */
export const Types: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <Button type="default">Default</Button>
        <Button type="primary">Primary</Button>
        <Button type="success">Success</Button>
        <Button type="warning">Warning</Button>
        <Button type="danger">Danger</Button>
        <Button type="info">Info</Button>
      </div>
    `
  })
};

/** 不同尺寸 */
export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <Button type="primary" size="large">Large</Button>
        <Button type="primary" size="medium">Medium</Button>
        <Button type="primary" size="small">Small</Button>
      </div>
    `
  })
};

/** 禁用状态 */
export const Disabled: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <Button type="primary" disabled>Disabled</Button>
        <Button type="success" disabled>Disabled</Button>
        <Button type="danger" disabled>Disabled</Button>
      </div>
    `
  })
};

/** Loading 状态 */
export const Loading: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px;">
        <Button type="primary" loading>Loading...</Button>
      </div>
    `
  })
};

/** 圆角按钮 */
export const Round: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px;">
        <Button type="primary" round>Round</Button>
        <Button type="success" round>Round</Button>
      </div>
    `
  })
};

/** 朴素按钮 */
export const Plain: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <Button type="primary" plain>Primary</Button>
        <Button type="success" plain>Success</Button>
        <Button type="warning" plain>Warning</Button>
        <Button type="danger" plain>Danger</Button>
      </div>
    `
  })
};
