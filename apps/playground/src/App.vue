<template>
  <main class="demo">
    <h1>VCL 组件库接入示例</h1>
    <p class="demo__tip">本页通过 <code>@vcl/components</code> 按需引入组件并加载 <code>style.css</code>。</p>

    <section class="demo__section">
      <h2>Button</h2>
      <div class="demo__row">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success" size="small">成功</Button>
        <Button type="danger" :loading="loading" @click="toggleLoading">点击加载</Button>
        <Button disabled>禁用</Button>
      </div>
    </section>

    <section class="demo__section">
      <h2>Input</h2>
      <div class="demo__row">
        <Input v-model="username" placeholder="请输入用户名" clearable style="width: 220px" />
        <Input v-model="password" type="password" placeholder="请输入密码" style="width: 220px" />
      </div>
      <p class="demo__tip">当前输入：{{ username || '（空）' }}</p>
    </section>

    <section class="demo__section">
      <h2>Select</h2>
      <div class="demo__row">
        <Select v-model="city" :options="cityOptions" placeholder="请选择城市" clearable style="width: 220px" />
      </div>
      <p class="demo__tip">当前选择：{{ city || '（空）' }}</p>
    </section>

    <section class="demo__section">
      <h2>Dialog</h2>
      <div class="demo__row">
        <Button type="primary" @click="dialogVisible = true">打开对话框</Button>
      </div>

      <Dialog v-model="dialogVisible" title="提示" width="420px">
        <p>组件库在企业内部可按需引入，也可以全局注册。</p>
        <template #footer>
          <Button size="small" @click="dialogVisible = false">取消</Button>
          <Button type="primary" size="small" @click="dialogVisible = false">确定</Button>
        </template>
      </Dialog>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Dialog, Input, Select, type SelectOption } from '@vcl/components';

const username = ref('');
const password = ref('');
const city = ref<string | number>('');
const dialogVisible = ref(false);
const loading = ref(false);

const cityOptions: SelectOption[] = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou', disabled: true }
];

const toggleLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1200);
};
</script>

<style>
:root {
  /* 覆盖组件库暴露的 CSS 变量，演示换肤 */
  --ml-btn-focus-ring: rgba(24, 144, 255, 0.6);
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: #1f2329;
  background: #f7f8fa;
}

.demo {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.demo h1 {
  font-size: 22px;
  margin: 0 0 8px;
}

.demo__tip {
  font-size: 13px;
  color: #646a73;
  margin: 8px 0 0;
}

.demo__section {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.demo__section h2 {
  font-size: 15px;
  margin: 0 0 16px;
}

.demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
