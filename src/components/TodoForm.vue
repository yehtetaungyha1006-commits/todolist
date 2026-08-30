<script setup>
import { reactive } from 'vue'

const form = reactive({
  text: '',
  priority: 'normal',
  dueDate: ''
})

function resetForm() {
  form.text = ''
  form.priority = 'normal'
  form.dueDate = ''
}
function dosubmit() {
  alert(form.text + form.dueDate + form.priority)
}
</script>

<template>
  <div>
    <h2>Todo Form</h2>
    <form>
    <div>Text: 
      <input v-model="form.text" type="text" placeholder="Enter todo" />
    </div>
    <br>
    <div>
      Priority:
      <select v-model="form.priority">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
    </div>
    <br>
    <div>
      Due Date: <input v-model="form.dueDate" type="date" />
    </div>
    <br>
    <button @click="resetForm">
      Reset
    </button>
    <button @click="dosubmit">
      Submit
    </button>
    <hr>
    <p>Todo: {{ form.text }}</p>
    <p>Priority: {{ form.priority }}</p>
    <p>Due Date: {{ form.dueDate }}</p> 
    </form>
  </div>
 
</template>

<style scoped>
button {
  margin: 10px;
}

input,
select {
  padding: 5px;
  margin: 5px;
}
</style>