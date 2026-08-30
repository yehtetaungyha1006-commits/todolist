<script setup>
import { ref, computed } from 'vue'

const newTodo = ref('')
const editId = ref(null)
const editText = ref('')

const todos = ref([
  { id: 101, text: 'อ่าน Vue', done: true },
  { id: 102, text: 'ทำ Todo', done: false }
])

const addTodo = () => {
  if (newTodo.value.trim() !== '') {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      done: false
    })

    newTodo.value = ''
  }
}

const deleteTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id)
}

const cancelEdit = () => {
  editId.value = null
  editText.value = ''
}

const startEdit = (todo) => {
  editId.value = todo.id
  editText.value = todo.text
}

const updateTodo = (todo) => {
  if (editText.value.trim() !== '') {
    todo.text = editText.value
  }

  editId.value = null
  editText.value = ''
}

const completedCount = computed(() =>
  todos.value.filter(todo => todo.done === true).length
)

const incompleteCount = computed(() =>
  todos.value.filter(todo => todo.done === false).length
)

</script>

<template>
  <div class="todo-container">

    <h2>Todo List</h2>

    <div class="add-box">
      <label>Text : </label>

      <input
        v-model="newTodo"
        type="text"
        placeholder="Todo"
      />

      <button @click="addTodo">
        Add
      </button>
    </div>

    <div class="summary">
      <span>
        จำนวนที่เสร็จ {{ completedCount }}
      </span>

      <span>
        จำนวนที่ไม่เสร็จ {{ incompleteCount }}
      </span>
    </div>

    <ul>
      <li
        v-for="(todo, index) in todos"
        :key="todo.id"
      >

        <div v-if="editId === todo.id">
          <input v-model="editText" />

          <button @click="updateTodo(todo)">
            Save
          </button>

        <button @click="cancelEdit">
            Cancel
        </button>
        </div>

        <div v-else>
          {{ index + 1 }}. {{ todo.text }}

          <button @click="startEdit(todo)">
            Update
          </button>

          <button @click="deleteTodo(todo.id)">
            Delete
          </button>
        </div>

      </li>
    </ul>

  </div>
</template>

<style scoped>
.todo-container {
  max-width: 760px;
  margin: 40px auto;
  padding: 28px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: Arial, sans-serif;
}

h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 30px;
  color: #2c3e50;
}

.add-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
}

.add-box label {
  font-weight: 600;
  color: #34495e;
}

input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

button {
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s;
}

button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.add-box button {
  background: #42b883;
  color: white;
}

.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}

.summary span {
  padding: 16px;
  background: #f5f7fa;
  border: 1px solid #e8ebef;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 12px;
  padding: 15px 16px;
  background: #f9fafb;
  border: 1px solid #eceff3;
  border-radius: 10px;
}

li > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

li input {
  max-width: 320px;
}

li button:nth-of-type(1) {
  background: #3498db;
  color: white;
}

li button:nth-of-type(2) {
  background: #e74c3c;
  color: white;
}

li div[v-if] button:nth-of-type(1) {
  background: #42b883;
  color: white;
}

@media (max-width: 600px) {
  .todo-container {
    margin: 20px 12px;
    padding: 20px;
  }

  .add-box {
    flex-direction: column;
    align-items: stretch;
  }

  .summary {
    grid-template-columns: 1fr;
  }

  li > div {
    flex-wrap: wrap;
  }

  input {
    width: 100%;
  }
}
</style>