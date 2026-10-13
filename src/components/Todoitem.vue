<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  todo: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  editText: { type: String, default: '' }
})

const emit = defineEmits([
  'start-edit',
  'update-todo',
  'cancel-edit',
  'delete-todo',
  'toggle-done',
  'update:edit-text'
])

const inputRef = ref(null)

watch(
  () => props.isEditing,
  async (active) => {
    if (active) {
      await nextTick()
      inputRef.value?.focus()
      inputRef.value?.select()
    }
  }
)

const onToggle = (event) => {
  emit('toggle-done', {
    id: props.todo.id,
    done: event.target.checked
  })
}
</script>

<template>
  <div class="todo-row" :class="{ editing: isEditing }">
    <label class="todo-check-wrapper" title="คลิกเพื่อสลับสถานะ">
      <input
        type="checkbox"
        class="todo-checkbox"
        :checked="todo.done"
        @change="onToggle"
      />
    </label>

    <div class="todo-main">
      <template v-if="!isEditing">
        <span class="todo-text" :class="{ done: todo.done }" @dblclick="emit('start-edit')">
          {{ todo.text }}
        </span>

        <div class="actions">
          <button
            type="button"
            class="action-btn edit-btn"
            title="แก้ไขข้อความ"
            @click="emit('start-edit')"
          >
            ✏️ แก้ไข
          </button>
          <button
            type="button"
            class="action-btn delete-btn"
            title="ลบรายการนี้"
            @click="emit('delete-todo', todo.id)"
          >
            🗑️ ลบ
          </button>
        </div>
      </template>

      <template v-else>
        <input
          ref="inputRef"
          type="text"
          class="edit-input"
          :value="editText"
          placeholder="พิมพ์ข้อความใหม่..."
          @input="emit('update:edit-text', $event.target.value)"
          @keyup.enter="emit('update-todo')"
          @keyup.esc="emit('cancel-edit')"
        />

        <div class="actions">
          <button
            type="button"
            class="action-btn save-btn"
            title="บันทึก (Enter)"
            @click="emit('update-todo')"
          >
            💾 บันทึก
          </button>
          <button
            type="button"
            class="action-btn cancel-btn"
            title="ยกเลิก (Esc)"
            @click="emit('cancel-edit')"
          >
            ✕ ยกเลิก
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.todo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.todo-check-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
  transition: transform 0.15s ease;
}

.todo-checkbox:hover {
  transform: scale(1.1);
}

.todo-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  color: #1e293b;
  word-break: break-word;
  transition: color 0.2s, text-decoration 0.2s;
  cursor: pointer;
}

.todo-text.done {
  text-decoration: line-through;
  color: #94a3b8;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.edit-btn {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}

.edit-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.save-btn {
  background: #10b981;
  color: #ffffff;
}

.save-btn:hover {
  background: #059669;
}

.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
  border-color: #cbd5e1;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.edit-input {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  font-size: 15px;
  color: #0f172a;
  background: #ffffff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

@media (max-width: 540px) {
  .todo-row {
    flex-wrap: wrap;
  }
  .todo-main {
    flex-direction: column;
    align-items: flex-start;
  }
  .actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>