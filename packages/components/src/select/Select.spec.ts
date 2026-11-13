import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Select from './Select.vue';
import type { SelectOption } from './Select.vue';

const options: SelectOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '西瓜', value: 'watermelon', disabled: true }
];

/**
 * Select 组件单元测试
 *
 * 覆盖：渲染、下拉交互、选项选择、禁用、清空、点击外部关闭
 */
describe('Select.vue', () => {
  // ===== 基础渲染 =====
  describe('rendering', () => {
    it('未选中时展示占位文本', () => {
      const wrapper = mount(Select, { props: { options, placeholder: '请选择水果' } });
      expect(wrapper.find('.ml-select__placeholder').text()).toBe('请选择水果');
    });

    it('已选中时展示对应标签', () => {
      const wrapper = mount(Select, { props: { options, modelValue: 'banana' } });
      expect(wrapper.find('.ml-select__label').text()).toBe('香蕉');
    });

    it('按 size 渲染对应类名', () => {
      for (const size of ['large', 'medium', 'small'] as const) {
        const wrapper = mount(Select, { props: { options, size } });
        expect(wrapper.classes()).toContain(`ml-select--${size}`);
      }
    });

    it('无选项时展示空态文案', async () => {
      const wrapper = mount(Select, { props: { options: [], emptyText: '没有数据' } });
      await wrapper.find('.ml-select__inner').trigger('click');
      expect(wrapper.find('.ml-select__empty').text()).toBe('没有数据');
    });
  });

  // ===== 下拉交互 =====
  describe('dropdown', () => {
    it('点击选择框打开下拉并触发 visible-change', async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find('.ml-select__inner').trigger('click');
      expect(wrapper.find('.ml-select__dropdown').isVisible()).toBe(true);
      expect(wrapper.emitted('visible-change')?.[0]).toEqual([true]);
    });

    it('再次点击收起下拉', async () => {
      const wrapper = mount(Select, { props: { options } });
      const inner = wrapper.find('.ml-select__inner');
      await inner.trigger('click');
      await inner.trigger('click');
      expect(wrapper.emitted('visible-change')).toEqual([[true], [false]]);
    });

    it('点击组件外部收起下拉', async () => {
      const wrapper = mount(Select, { props: { options }, attachTo: document.body });
      await wrapper.find('.ml-select__inner').trigger('click');
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.ml-select__dropdown').isVisible()).toBe(false);
      wrapper.unmount();
    });
  });

  // ===== 选项选择 =====
  describe('selection', () => {
    it('点击选项触发 update:modelValue 与 change', async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find('.ml-select__inner').trigger('click');
      await wrapper.findAll('.ml-select__option')[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple']);
      expect(wrapper.emitted('change')?.[0]).toEqual(['apple']);
    });

    it('选中后收起下拉', async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find('.ml-select__inner').trigger('click');
      await wrapper.findAll('.ml-select__option')[1].trigger('click');
      expect(wrapper.emitted('visible-change')?.[1]).toEqual([false]);
    });

    it('禁用选项不可选中', async () => {
      const wrapper = mount(Select, { props: { options } });
      await wrapper.find('.ml-select__inner').trigger('click');
      const disabledOption = wrapper.findAll('.ml-select__option')[2];
      expect(disabledOption.classes()).toContain('is-disabled');
      await disabledOption.trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('选中项带 is-selected 类名', async () => {
      const wrapper = mount(Select, { props: { options, modelValue: 'apple' } });
      await wrapper.find('.ml-select__inner').trigger('click');
      expect(wrapper.findAll('.ml-select__option')[0].classes()).toContain('is-selected');
    });
  });

  // ===== 禁用 / 清空 =====
  describe('disabled & clearable', () => {
    it('禁用状态不打开下拉', async () => {
      const wrapper = mount(Select, { props: { options, disabled: true } });
      expect(wrapper.classes()).toContain('ml-select--disabled');
      await wrapper.find('.ml-select__inner').trigger('click');
      expect(wrapper.emitted('visible-change')).toBeFalsy();
    });

    it('有值时展示清空按钮', () => {
      const wrapper = mount(Select, { props: { options, modelValue: 'apple', clearable: true } });
      expect(wrapper.find('.ml-select__clear').exists()).toBe(true);
    });

    it('点击清空触发 update / change / clear', async () => {
      const wrapper = mount(Select, { props: { options, modelValue: 'apple', clearable: true } });
      await wrapper.find('.ml-select__clear').trigger('click');
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
      expect(wrapper.emitted('change')?.[0]).toEqual([undefined]);
      expect(wrapper.emitted('clear')).toBeTruthy();
    });
  });
});
