<script setup>
import { ref } from 'vue'

const newTodo = ref('')
const count = ref(0)

function increment() {
  count.value += 1  // ใน script ใช้ .value
}
function decrement() {
  count.value -= 1  // ใน script ใช้ .value
}
function reset() {
  count.value = 0  // ใน script ใช้ .value
}
</script>

<template>
  <!-- template แกะ .value ให้อัตโนมัติ -->
  <p>{{ count }}</p>
  <button @click="increment">increment</button> 
  <button @click="decrement">decrement</button>
  <button @click="reset">reset</button>
</template>
 
<style scoped>button {margin: 5px; } </style>