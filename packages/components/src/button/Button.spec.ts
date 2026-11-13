import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

/**
 * Button 组件单元测试
 *
 * 覆盖：渲染、Props 响应、事件触发、边界条件
 */
describe('Button.vue', () => {
  // ===== 基础渲染 =====
  describe('rendering', () => {
    it('正确渲染默认类型按钮', () => {
      const wrapper = mount(Button, { slots: { default: '按钮' } });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toBe('按钮');
      expect(wrapper.classes()).toContain('ml-btn--default');
    });

    it('渲染所有支持的 type', () => {
      const types = ['primary', 'success', 'warning', 'danger', 'info', 'default'] as const;
      for (const type of types) {
        const wrapper = mount(Button, { props: { type } });
        expect(wrapper.classes()).toContain(`ml-btn--${type}`);
      }
    });

    it('渲染所有支持的 size', () => {
      const sizes = ['large', 'medium', 'small'] as const;
      for (const size of sizes) {
        const wrapper = mount(Button, { props: { size } });
        expect(wrapper.classes()).toContain(`ml-btn--${size}`);
      }
    });
  });

  // ===== 状态类名 =====
  describe('state classes', () => {
    it('disabled 状态添加对应类名并设置原生 disabled', () => {
      const wrapper = mount(Button, { props: { disabled: true } });
      expect(wrapper.classes()).toContain('ml-btn--disabled');
      expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('loading 状态添加对应类名', () => {
      const wrapper = mount(Button, { props: { loading: true } });
      expect(wrapper.classes()).toContain('ml-btn--loading');
      expect(wrapper.find('.ml-btn__spinner').exists()).toBe(true);
    });

    it('round 状态添加圆角类名', () => {
      const wrapper = mount(Button, { props: { round: true } });
      expect(wrapper.classes()).toContain('ml-btn--round');
    });

    it('plain 状态添加朴素类名', () => {
      const wrapper = mount(Button, { props: { plain: true, type: 'primary' } });
      expect(wrapper.classes()).toContain('ml-btn--plain');
    });
  });

  // ===== 事件 =====
  describe('events', () => {
    it('正常状态下触发 click 事件', async () => {
      const wrapper = mount(Button, { props: { type: 'primary' } });
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeTruthy();
      expect(wrapper.emitted('click')!.length).toBe(1);
    });

    it('disabled 状态下不触发 click 事件', async () => {
      const wrapper = mount(Button, { props: { disabled: true } });
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('loading 状态下不触发 click 事件', async () => {
      const wrapper = mount(Button, { props: { loading: true } });
      await wrapper.trigger('click');
      expect(wrapper.emitted('click')).toBeFalsy();
    });
  });

  // ===== htmlType =====
  describe('htmlType', () => {
    it('默认 htmlType 为 button', () => {
      const wrapper = mount(Button);
      expect(wrapper.attributes('type')).toBe('button');
    });

    it('正确传递 submit / reset 类型', () => {
      const submit = mount(Button, { props: { htmlType: 'submit' } });
      expect(submit.attributes('type')).toBe('submit');

      const reset = mount(Button, { props: { htmlType: 'reset' } });
      expect(reset.attributes('type')).toBe('reset');
    });
  });
});

/**
 * 共享工具函数测试
 */
import { bem, isValidValue } from '../shared/utils';

describe('utils', () => {
  describe('bem', () => {
    it('生成 block 类名', () => {
      expect(bem('button')).toBe('ml-button');
    });

    it('生成 block + element 类名', () => {
      expect(bem('button', 'icon')).toBe('ml-button__icon');
    });

    it('生成带 modifier 的类名', () => {
      const result = bem('button', 'icon', { active: true, disabled: false });
      expect(result).toBe('ml-button__icon ml-button__icon--active');
    });
  });

  describe('isValidValue', () => {
    it('在允许列表中返回 true', () => {
      expect(isValidValue('primary', ['primary', 'success'])).toBe(true);
    });

    it('不在允许列表中返回 false', () => {
      expect(isValidValue('unknown', ['primary', 'success'])).toBe(false);
    });
  });
});
