<script setup>
import TodoList from './components/TodoList.vue'
</script>

<template>
  <main class="page">
    <TodoList />
  </main>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef5ff 0%, #f7faff 100%);
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  color: #1e293b;
}

.page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>