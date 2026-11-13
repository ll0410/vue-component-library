# 第 9 章 企业内使用

组件库写完、测完、构建完，最后一步是让同事能真正装上并稳定使用。企业内使用与开源发布最大的区别在于：**制品不公开、网络环境受限、升级需要可控**。本章给出可落地的完整链路。

## 9.1 三种分发模式

| 模式 | 适用场景 | 优点 | 代价 |
|------|----------|------|------|
| 私服 npm（推荐） | 多个业务团队共用 | 版本明确、依赖锁定、与 npm 生态一致 | 需要维护私服与发布权限 |
| Monorepo workspace | 组件库与业务在同一仓库 | 改完即用、无发布流程 | 跨仓库无法复用，业务仓库体积膨胀 |
| Git 子模块 / 源码复制 | 临时验证、Demo | 零基础设施 | 无法管理版本，样式与类型易失同步 |

**结论**：只要有两个以上仓库需要复用组件，就走私服 npm。本章后续内容都基于私服方案。

## 9.2 前置准备

### 确定包 scope

当前包名为 `@vcl/components`。企业内建议替换为公司 scope（如 `@corp/components`），需要同步修改的只有 3 处：

1. `packages/components/package.json` 的 `name`
2. `packages/docs/docs` 下所有示例代码中的 import 语句
3. `README.md` 与示例应用的引入路径

::: tip
scope 一旦发布就不建议再改，否则消费方需要全量替换 import。项目初期定好，后续保持稳定。
:::

### 申请发布权限

| 需要的东西 | 说明 |
|------------|------|
| 私服地址 | 完整 registry URL，包含仓库路径 |
| 发布账号 / Token | 具备该 scope 的 publish 权限，仅用于 CI |
| 读取权限 | 所有业务方开发者也需能读取该 scope |

发布 Token 只放在 CI Secret 中，不要写进仓库文件。

## 9.3 私服配置对照

三种常见私服的 registry 形态不同，认证写法基本一致（`_authToken`）。

| 私服 | registry 地址示例 | 认证方式 |
|------|-------------------|----------|
| Nexus 3 | `https://npm.example.com/repository/npm-private/` | `//host/repository/npm-private/:_authToken=...` |
| Verdaccio | `https://npm.example.com/` | `//host/:_authToken=...` |
| GitLab Package Registry | `https://gitlab.example.com/api/v4/packages/npm/` | `//gitlab.example.com/api/v4/packages/npm/:_authToken=...` |

项目根目录提供了模板 `.npmrc.example`：

```ini
@vcl:registry=https://npm.example.com/repository/npm-private/
//npm.example.com/repository/npm-private/:_authToken=${NPM_TOKEN}
```

使用方式：

1. 复制为 `.npmrc`（或写入消费方项目的 `.npmrc`）
2. 把 `npm.example.com` 换成企业私服地址
3. 设置环境变量 `NPM_TOKEN` 后执行 `pnpm install`

::: warning 不要把私服地址写进仓库根 `.npmrc`
未接入私服的环境（如新同事首次 clone、CI 未配 Token）会直接安装失败。私服地址应只存在于本地 `.npmrc`（已被忽略）或 CI 变量中。
:::

## 9.4 首次发布

发布链路是：**改代码 → 写 changeset → 升版本 → 打 tag → CI 发布**。

```bash
# 1. 记录变更（交互式选择包与变更级别）
pnpm changeset

# 2. 应用 changeset，更新版本号与 CHANGELOG
pnpm version

# 3. 提交版本变更
git add .
git commit -m "chore(release): v0.1.0"

# 4. 打 tag 触发发布 workflow
git tag v0.1.0
git push --follow-tags
```

对应的 workflow 为 `.github/workflows/release.yml`，触发条件为 `v*` tag 或手动 `workflow_dispatch`，执行内容：

1. 校验仓库变量 `NPM_REGISTRY` 与 Secret `NPM_TOKEN` 是否存在
2. `pnpm install --frozen-lockfile`
3. `pnpm build:components`
4. `pnpm --filter @vcl/components publish --no-git-checks`

发布前需要在仓库 Settings 中配置：

| 类型 | 名称 | 值 |
|------|------|-----|
| Variable | `NPM_REGISTRY` | 私服 registry 地址 |
| Secret | `NPM_TOKEN` | 发布 Token |

发布后校验：

```bash
npm view @vcl/components version --registry=https://npm.example.com/
npm view @vcl/components dist.tarball --registry=https://npm.example.com/
```

正常输出应为你刚才的版本号与私服上的 tarball 地址。

## 9.5 版本策略

内部组件库建议按「稳定优先」制定规则：

| 场景 | 变更级别 | 示例 |
|------|----------|------|
| 修复样式错位、逻辑 bug | patch | `0.4.1 → 0.4.2` |
| 新增组件、新增可选 prop | minor | `0.4.2 → 0.5.0` |
| 删除 prop、改变默认行为、重命名 CSS 类名 | major | `0.5.0 → 1.0.0` |

内部 0.x 阶段约定：

- `0.x` 不承诺向后兼容，但**仍要走 changeset**，让消费方看到变更记录
- 破坏性变更必须在 CHANGELOG 中单独标注，并同步到群里
- 组件废弃先标记 `deprecated`（JSDoc + 文档提示），至少保留一个 minor 周期再删除

发现已发布版本有严重问题时：

```bash
# 标记废弃版本，引导升级
npm deprecate "@vcl/components@0.4.2" "存在样式缺陷，请升级到 0.4.3" --registry=https://npm.example.com/
```

回滚则发布一个修复版本（`0.4.3`），不建议直接重发旧版本号——npm 私服通常不允许覆盖已发布版本。

## 9.6 消费方接入

### 安装

```bash
pnpm add @vcl/components
```

`package.json` 中固定版本更利于企业内部稳定：

```json
{
  "dependencies": {
    "@vcl/components": "0.4.3"
  }
}
```

### 按需引入（推荐）

```ts
import { Button, Input } from '@vcl/components';
import '@vcl/components/style.css';
```

```vue
<template>
  <Button type="primary" @click="submit">提交</Button>
  <Input v-model="keyword" placeholder="请输入" clearable />
</template>
```

### 全局注册

```ts
import { createApp } from 'vue';
import { Button, Dialog, Input, Select } from '@vcl/components';
import '@vcl/components/style.css';

const app = createApp(App);
[Button, Dialog, Input, Select].forEach((component) => {
  app.component(component.name!, component);
});
app.mount('#app');
```

### 注意事项

| 事项 | 说明 |
|------|------|
| `vue` 必须由宿主应用安装 | `vue` 声明为 peerDependency，组件库不重复打包 |
| 样式必须单独引入 | `@vcl/components/style.css`，否则组件无样式 |
| Vite 项目 | 无需额外配置，`exports` 已区分 `import` / `require` |
| Webpack 4 | 需处理 `.mjs` 与 `exports` 字段，建议升级到 Webpack 5 |
| TypeScript | 类型由 `dist/index.d.ts` 提供，`moduleResolution` 建议 `bundler` 或 `node16` |
| SSR | 组件内部已处理 `window` / `document` 判断，Nuxt 中按普通组件引入即可 |

可运行示例见仓库 `apps/playground`：

```bash
pnpm build:components   # 先生成 dist
pnpm playground         # 启动示例应用
```

示例应用通过 `workspace:*` 引用组件包；接入私服后改成版本号即可：

```json
{
  "dependencies": {
    "@vcl/components": "^0.4.3"
  }
}
```

## 9.7 升级与灰度

- **锁版本**：业务方使用精确版本或 `~`，避免 minor 自动升级带来意外
- **批量升级**：组件库发布 minor 后，统一在业务仓库执行 `pnpm up @vcl/components`，走一次回归
- **灰度**：先在一个业务线升级验证，再全量推广；可在 changeset 中写清风险点
- **破坏性变更**：提前一个版本在文档与 CHANGELOG 中通告，给出迁移示例

## 9.8 治理规范

| 事项 | 约定 |
|------|------|
| 谁能发布 | 私服账号仅授予组件库维护者；CI 使用独立发布 Token |
| 变更记录 | 每个影响产物的 PR 必须带 changeset，否则不合并 |
| 代码归属 | 用 `CODEOWNERS` 指定组件目录的 review 责任人 |
| 文档同步 | 新增/修改组件必须同步 `packages/docs/docs/components` |
| 样式约定 | 统一使用 `.ml-` 前缀与 BEM，避免与业务样式冲突 |

`.github/CODEOWNERS` 示例：

```
/packages/components/  @corp/frontend-infra
/packages/docs/        @corp/frontend-infra
```

## 9.9 常见问题

| 问题 | 原因与处理 |
|------|------------|
| `Cannot find module 'vue'` | 组件库把 vue 作为 peerDependency，宿主应用需自行安装 vue |
| 组件无样式 | 忘记引入 `@vcl/components/style.css` |
| 类型提示缺失 | 检查 `moduleResolution`；确认安装的版本包含 `dist/index.d.ts` |
| 私服 401 | `NPM_TOKEN` 未设置或已过期；确认 `.npmrc` 中 `_authToken` 对应的 host 与 registry 一致 |
| 私服 404 | scope 未指向私服，或包尚未发布；用 `npm view` 带上 `--registry` 排查 |
| 出现两份 Vue | 业务方 lockfile 中存在多个 vue 版本，用 `pnpm why vue` 定位并统一 |
| 升级后样式错乱 | 可能存在类名或 CSS 变量变更，查看 CHANGELOG 中的破坏性变更条目 |
