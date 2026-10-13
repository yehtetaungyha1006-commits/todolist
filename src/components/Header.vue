<script setup>
const isShowHeader = true
const isMaintence = false
</script>

<template>
  <header class="app-header">
    <div class="brand-badge">Vue 3 + Express Backend</div>
    <h1 v-if="isShowHeader" class="title">Todo List App</h1>
    <h1 v-else-if="isMaintence" class="title">List Application</h1>
    <h1 v-else class="title">Header is hidden</h1>

    <p v-show="isShowHeader" class="subtitle">จัดการงานและเชื่อมต่อฐานข้อมูล Backend อย่างเป็นระบบ</p>
  </header>
</template>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 24px;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #0d9488;
  background: #ccfbf1;
  border: 1px solid #99f6e4;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.1);
}

.title {
  margin: 0 0 8px;
  font-size: 34px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0;
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
}
</style>