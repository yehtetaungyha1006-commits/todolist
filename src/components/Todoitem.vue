<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  editText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'start-edit',
  'update-todo',
  'cancel-edit',
  'delete-todo',
  'toggle-done',
  'update:editText'
])
</script>

<template>
  <div v-if="isEditing" class="item-content">
      <input
        class="edit-input"
        :value="editText"
        @input="emit('update:editText', $event.target.value)"
      />

      <button
        class="action-button save-button"
        @click="emit('update-todo', todo)"
      >
        Save
      </button>

      <button
        class="action-button cancel-button"
        @click="emit('cancel-edit')"
      >
        Cancel
      </button>
  </div>

  <div v-else class="item-content">
      <label class="todo-check">
        <input
          class="done-checkbox"
          type="checkbox"
          v-model="todo.done"
          :aria-label="`ทำ ${todo.text} เสร็จแล้ว`"
          @change="emit('toggle-done', { todo, done: todo.done })"
        />
        <span>{{ index + 1 }}. {{ todo.text }}</span>
      </label>

      <button
        class="action-button update-button"
        @click="emit('start-edit', todo)"
      >
        Update
      </button>

      <button
        class="action-button delete-button"
        @click="emit('delete-todo', todo.id)"
      >
        Delete
      </button>
  </div>
</template>

<style scoped>
.item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-check {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
  min-width: 0;
  cursor: pointer;
}

.done-checkbox {
  display: inline-block;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  margin: 0 4px 0 0;
  opacity: 1;
  appearance: auto;
  accent-color: #42b883;
  cursor: pointer;
}

.edit-input {
  flex: 1;
  max-width: 320px;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: 0.2s;
}

.edit-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.12);
}

.action-button {
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s;
}

.action-button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.update-button {
  background: #3498db;
}

.delete-button {
  background: #e74c3c;
}

.save-button {
  background: #42b883;
}

.cancel-button {
  background: #e74c3c;
}

@media (max-width: 600px) {
  .item-content {
    flex-wrap: wrap;
  }

  .edit-input {
    width: 100%;
    max-width: none;
  }
}
</style>