import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import Button from '../button/Button.vue';
import '../styles/dialog.css';
import '../styles/button.css';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: '标题' },
    width: { control: 'text', description: '宽度' },
    showClose: { control: 'boolean', description: '是否显示关闭按钮' },
    closeOnClickModal: { control: 'boolean', description: '点击遮罩是否关闭' },
    onUpdate: { action: 'update:modelValue' },
    onOpen: { action: 'open' },
    onClose: { action: 'close' }
  },
  args: {
    title: '提示',
    width: '480px',
    showClose: true,
    closeOnClickModal: true
  }
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/** 基础用法 */
export const Basic: Story = {
  render: (args) => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <Button type="primary" @click="visible = true">打开对话框</Button>
      <Dialog v-bind="args" v-model="visible">
        <p>这是一段对话框的内容，点击遮罩或右上角关闭。</p>
      </Dialog>
    `
  })
};

/** 带底部操作按钮 */
export const WithFooter: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <Button type="primary" @click="visible = true">打开对话框</Button>
      <Dialog v-model="visible" title="确认删除">
        <p>删除后数据将无法恢复，确定继续吗？</p>
        <template #footer>
          <Button size="small" @click="visible = false">取消</Button>
          <Button size="small" type="danger" @click="visible = false">确定</Button>
        </template>
      </Dialog>
    `
  })
};

/** 自定义头部 */
export const CustomHeader: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <Button type="primary" @click="visible = true">自定义头部</Button>
      <Dialog v-model="visible">
        <template #header>
          <span style="color: #409eff; font-weight: 600;">自定义标题区域</span>
        </template>
        <p>头部插槽可以完全替换默认标题。</p>
      </Dialog>
    `
  })
};

/** 不关闭遮罩点击 */
export const NoCloseOnModal: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup() {
      const visible = ref(false);
      return { visible };
    },
    template: `
      <Button type="primary" @click="visible = true">点击遮罩不关闭</Button>
      <Dialog v-model="visible" title="强制操作" :close-on-click-modal="false">
        <p>必须点击右上角关闭按钮才能关闭。</p>
      </Dialog>
    `
  })
};
