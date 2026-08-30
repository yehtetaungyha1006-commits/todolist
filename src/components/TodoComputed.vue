<script setup>
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: 'อ่าน Vue', done: true },
  { id: 2, text: 'ทำ Lab', done: false }
])

const remaining = computed(() =>
  todos.value.filter(todo => !todo.done).length
)

const completed = computed(() =>
  todos.value.filter(todo => todo.done).length
)
</script>

<template>
    <div class="todo-container">
    <h2>สรุปงาน (todo) </h2>
<p><strong>เหลือ {{ remaining }} งาน</strong></p>
<p><string>เสร็จแล้ว {{ completed }} งาน</string></p>
</div>
</template>
