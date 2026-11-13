import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Dialog from './Dialog.vue';

/**
 * Dialog 组件单元测试
 *
 * 注意：Dialog 使用 Teleport 挂载到 body，断言需直接查询 document.body
 */
describe('Dialog.vue', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  const query = (selector: string) => document.body.querySelector(selector) as HTMLElement | null;

  // ===== 显隐 =====
  describe('visibility', () => {
    it('modelValue 为 false 时不渲染对话框', () => {
      mount(Dialog, { props: { modelValue: false } });
      expect(query('.ml-dialog')).toBeNull();
    });

    it('modelValue 为 true 时渲染对话框与标题', () => {
      mount(Dialog, { props: { modelValue: true, title: '提示' } });
      expect(query('.ml-dialog')).not.toBeNull();
      expect(query('.ml-dialog__title')?.textContent).toBe('提示');
    });

    it('打开时触发 open 事件', () => {
      const wrapper = mount(Dialog, { props: { modelValue: true } });
      expect(wrapper.emitted('open')).toBeTruthy();
    });
  });

  // ===== 关闭方式 =====
  describe('closing', () => {
    it('点击关闭按钮触发 update:modelValue(false)', async () => {
      const wrapper = mount(Dialog, { props: { modelValue: true } });
      query('.ml-dialog__close')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('点击遮罩关闭', async () => {
      const wrapper = mount(Dialog, { props: { modelValue: true } });
      query('.ml-dialog__wrapper')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('closeOnClickModal 为 false 时点击遮罩不关闭', async () => {
      const wrapper = mount(Dialog, {
        props: { modelValue: true, closeOnClickModal: false }
      });
      query('.ml-dialog__wrapper')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('按 Esc 关闭', async () => {
      const wrapper = mount(Dialog, { props: { modelValue: true } });
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('showClose 为 false 时不渲染关闭按钮', () => {
      mount(Dialog, { props: { modelValue: true, showClose: false } });
      expect(query('.ml-dialog__close')).toBeNull();
    });

    it('关闭时触发 close 事件', async () => {
      const wrapper = mount(Dialog, { props: { modelValue: true } });
      await wrapper.setProps({ modelValue: false });
      expect(wrapper.emitted('close')).toBeTruthy();
    });
  });

  // ===== 内容 =====
  describe('content', () => {
    it('渲染默认插槽内容', () => {
      mount(Dialog, { props: { modelValue: true }, slots: { default: '<p>正文内容</p>' } });
      expect(query('.ml-dialog__body')?.textContent).toContain('正文内容');
    });

    it('渲染 footer 插槽', () => {
      mount(Dialog, { props: { modelValue: true }, slots: { footer: '<button>确定</button>' } });
      expect(query('.ml-dialog__footer')).not.toBeNull();
    });

    it('未提供 footer 插槽时不渲染底部区域', () => {
      mount(Dialog, { props: { modelValue: true } });
      expect(query('.ml-dialog__footer')).toBeNull();
    });

    it('header 插槽覆盖默认标题', () => {
      mount(Dialog, { props: { modelValue: true, title: '默认标题' }, slots: { header: '<b>自定义</b>' } });
      expect(query('.ml-dialog__title')).toBeNull();
      expect(query('.ml-dialog__header')?.textContent).toContain('自定义');
    });

    it('应用自定义宽度', () => {
      mount(Dialog, { props: { modelValue: true, width: '600px' } });
      expect(query('.ml-dialog')?.style.width).toBe('600px');
    });
  });
});
