<script setup>
    const isShowHeader = true
    const isMaintence = false
</script>
<template>
  <h1 v-if="isShowHeader">Todo List App</h1>
  <h1 v-else-if ="isMaintence">List Application</h1>
  <h1 v-else>Header is hidden</h1>
  
  <h1 v-show="isShowHeader">Welcome to Todo List App</h1>
</template>