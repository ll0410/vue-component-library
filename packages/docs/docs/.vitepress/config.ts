import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'VCL Vue 组件库',
  description: '从零打造企业级 Vue 3 组件库',
  lang: 'zh-CN',
  base: '/vue-component-library/',
  lastUpdated: true,
  cleanUrls: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-component-library/vue.svg' }]],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/01-architecture' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/ll0410/vue-component-library' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '架构设计与技术选型', link: '/guide/01-architecture' },
            { text: 'Monorepo 项目初始化', link: '/guide/02-init' },
            { text: '组件开发规范与流程', link: '/guide/03-component-dev' },
            { text: 'Storybook 组件开发', link: '/guide/04-storybook' },
            { text: '单元测试策略', link: '/guide/05-testing' },
            { text: 'VitePress 文档站', link: '/guide/06-docs-site' },
            { text: '构建与 npm 发布', link: '/guide/07-build-publish' },
            { text: '实战：从零造一个 Button', link: '/guide/08-button-example' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Dialog 对话框', link: '/components/dialog' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/ll0410/vue-component-library' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 VCL'
    },
    search: {
      provider: 'local'
    }
  }
});
