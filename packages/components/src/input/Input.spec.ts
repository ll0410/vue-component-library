import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from './Input.vue';

/**
 * Input 组件单元测试
 *
 * 覆盖：渲染、v-model、清空、事件、插槽、禁用态
 */
describe('Input.vue', () => {
  // ===== 基础渲染 =====
  describe('rendering', () => {
    it('渲染输入框并展示占位文本', () => {
      const wrapper = mount(Input, { props: { placeholder: '请输入' } });
      const input = wrapper.find('input');
      expect(input.exists()).toBe(true);
      expect(input.attributes('placeholder')).toBe('请输入');
    });

    it('渲染绑定的值', () => {
      const wrapper = mount(Input, { props: { modelValue: 'hello' } });
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello');
    });

    it('渲染所有支持的 size 类名', () => {
      for (const size of ['large', 'medium', 'small'] as const) {
        const wrapper = mount(Input, { props: { size } });
        expect(wrapper.classes()).toContain(`ml-input--${size}`);
      }
    });

    it('渲染 prefix / suffix 插槽', () => {
      const wrapper = mount(Input, {
        slots: { prefix: '￥', suffix: '元' }
      });
      expect(wrapper.find('.ml-input__prefix').text()).toBe('￥');
      expect(wrapper.find('.ml-input__suffix').text()).toBe('元');
    });
  });

  // ===== v-model =====
  describe('v-model', () => {
    it('输入时触发 update:modelValue', async () => {
      const wrapper = mount(Input, { props: { modelValue: '' } });
      await wrapper.find('input').setValue('abc');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc']);
    });

    it('原生 change 时触发 change 事件', async () => {
      const wrapper = mount(Input, { props: { modelValue: '' } });
      await wrapper.find('input').setValue('abc');
      await wrapper.find('input').trigger('change');
      expect(wrapper.emitted('change')?.[0]).toEqual(['abc']);
    });
  });

  // ===== 清空 =====
  describe('clearable', () => {
    it('有值时展示清空按钮', () => {
      const wrapper = mount(Input, { props: { modelValue: 'abc', clearable: true } });
      expect(wrapper.find('.ml-input__clear').exists()).toBe(true);
    });

    it('无值时不展示清空按钮', () => {
      const wrapper = mount(Input, { props: { modelValue: '', clearable: true } });
      expect(wrapper.find('.ml-input__clear').exists()).toBe(false);
    });

    it('未开启 clearable 时不展示清空按钮', () => {
      const wrapper = mount(Input, { props: { modelValue: 'abc' } });
      expect(wrapper.find('.ml-input__clear').exists()).toBe(false);
    });

    it('点击清空按钮触发 update / change / clear', async () => {
      const wrapper = mount(Input, { props: { modelValue: 'abc', clearable: true } });
      await wrapper.find('.ml-input__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
      expect(wrapper.emitted('change')?.[0]).toEqual(['']);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });
  });

  // ===== 事件 =====
  describe('events', () => {
    it('聚焦 / 失焦时触发对应事件', async () => {
      const wrapper = mount(Input);
      await wrapper.find('input').trigger('focus');
      await wrapper.find('input').trigger('blur');
      expect(wrapper.emitted('focus')).toBeTruthy();
      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  // ===== 状态 =====
  describe('states', () => {
    it('disabled 状态设置原生 disabled 属性并添加类名', () => {
      const wrapper = mount(Input, { props: { disabled: true } });
      expect(wrapper.classes()).toContain('ml-input--disabled');
      expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    });

    it('readonly 状态设置原生 readonly 属性', () => {
      const wrapper = mount(Input, { props: { readonly: true } });
      expect(wrapper.find('input').attributes('readonly')).toBeDefined();
    });

    it('透传 maxlength 与 type', () => {
      const wrapper = mount(Input, { props: { maxlength: 10, type: 'password' } });
      expect(wrapper.find('input').attributes('maxlength')).toBe('10');
      expect(wrapper.find('input').attributes('type')).toBe('password');
    });
  });

  // ===== 暴露方法 =====
  describe('expose', () => {
    it('暴露 focus 方法并可聚焦输入框', async () => {
      const wrapper = mount(Input, { attachTo: document.body });
      (wrapper.vm as unknown as { focus: () => void }).focus();
      expect(document.activeElement).toBe(wrapper.find('input').element);
      wrapper.unmount();
    });
  });
});
