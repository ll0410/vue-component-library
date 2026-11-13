import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { Button, Input, Select, Dialog } from '../../../../components/src';

/**
 * 文档站主题
 *
 * 直接引用组件库源码（workspace 内相对路径），
 * 使 Markdown 中可以直接书写 <Button /> 等组件进行实时演示。
 * 组件源码入口已内置样式导入（styles/*.css）。
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Button', Button);
    app.component('Input', Input);
    app.component('Select', Select);
    app.component('Dialog', Dialog);
  }
} satisfies Theme;
