import type { Preview } from '@storybook/vue3';
import type { App } from 'vue';

/**
 * 全局 decorator：为所有 Story 包裹一个带内边距的容器
 */
const withContainer = (storyFn: () => any) => ({
  components: { story: storyFn() },
  template: '<div style="padding: 24px;"><story /></div>'
});

const preview: Preview = {
  decorators: [withContainer],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
