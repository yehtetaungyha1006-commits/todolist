<script setup>
import { ref, computed, onMounted } from 'vue'
import TodoItem from './Todoitem.vue'

// Base URL ของ Backend (อ่านจาก .env หรือใช้ค่าเริ่มต้น http://localhost:3000)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

const newTodo = ref('')
const editId = ref(null)
const editText = ref('')
const todos = ref([])
const error = ref('')
const loading = ref(false)
const isAdding = ref(false)
const filterType = ref('all') // 'all' | 'active' | 'completed'
const backendOnline = ref(false)

// ฟังก์ชันกลางสำหรับเรียก Backend API
const request = async (path, options = {}) => {
  const url = `${API_URL}${path.startsWith('/') ? path : '/' + path}`
  
  let response
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    })
  } catch (netErr) {
    backendOnline.value = false
    throw new Error('ไม่สามารถเชื่อมต่อกับ Backend ได้ (กรุณารัน `npm run server` หรือเปิดพอร์ต 3000)')
  }

  if (!response.ok) {
    backendOnline.value = true
    let errorMsg = `เรียก API ไม่สำเร็จ (HTTP ${response.status})`
    try {
      const errorData = await response.json()
      if (errorData.message) errorMsg = errorData.message
    } catch {
      // ไม่มี json ให้ข้าม
    }
    throw new Error(errorMsg)
  }

  backendOnline.value = true
  if (response.status === 204) return null
  return response.json()
}

// 1. ดึงรายการ Todo ทั้งหมดจาก Backend
const fetchTodos = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await request('/todos')
    todos.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 2. เพิ่มรายการ Todo ใหม่
const addTodo = async () => {
  const text = newTodo.value.trim()
  if (!text || isAdding.value) return

  isAdding.value = true
  error.value = ''

  try {
    const created = await request('/todos', {
      method: 'POST',
      body: JSON.stringify({ text, done: false })
    })

    if (created && created.id) {
      todos.value.push(created)
    } else {
      await fetchTodos()
    }
    newTodo.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    isAdding.value = false
  }
}

// 3. สลับสถานะเสร็จ / ไม่เสร็จ (Toggle)
const toggleTodo = async ({ id, done }) => {
  error.value = ''
  
  // อัปเดตแบบ Optimistic เพื่อให้ UI ตอบสนองทันที
  const target = todos.value.find(item => item.id === id)
  const prevDone = target ? target.done : done
  if (target) target.done = done

  try {
    await request(`/todos/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ done })
    })
  } catch (err) {
    // คืนค่าเดิมหาก Backend บันทึกไม่สำเร็จ
    if (target) target.done = prevDone
    error.value = err.message
  }
}

// 4. เริ่มแก้ไข
const startEdit = (todo) => {
  editId.value = todo.id
  editText.value = todo.text
}

// ยกเลิกแก้ไข
const cancelEdit = () => {
  editId.value = null
  editText.value = ''
}

// 5. บันทึกการแก้ไข (Update)
const updateTodo = async (todo) => {
  const text = editText.value.trim()
  if (!text) return

  // ถ้าข้อความเหมือนเดิม ให้ปิดโหมดแก้ไขโดยไม่ต้องยิง API
  if (text === todo.text) {
    cancelEdit()
    return
  }

  error.value = ''

  try {
    const updated = await request(`/todos/${encodeURIComponent(todo.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ text })
    })

    if (updated) {
      todo.text = updated.text
    } else {
      todo.text = text
    }
    cancelEdit()
  } catch (err) {
    error.value = err.message
  }
}

// 6. ลบรายการ Todo (Delete)
const deleteTodo = async (id) => {
  error.value = ''
  const prevList = [...todos.value]
  todos.value = todos.value.filter(item => item.id !== id)

  try {
    await request(`/todos/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    })
  } catch (err) {
    todos.value = prevList
    error.value = err.message
  }
}

// นับจำนวน
const completedCount = computed(
  () => todos.value.filter(todo => todo.done).length
)

const incompleteCount = computed(
  () => todos.value.filter(todo => !todo.done).length
)

// รายการที่กรองตามแท็บ
const filteredTodos = computed(() => {
  if (filterType.value === 'active') {
    return todos.value.filter(t => !t.done)
  }
  if (filterType.value === 'completed') {
    return todos.value.filter(t => t.done)
  }
  return todos.value
})

onMounted(fetchTodos)
</script>

<template>
  <div class="todo-card">
    <h2>Todo List</h2>

    <!-- แถบแจ้งเตือน Error -->
    <div v-if="error" class="error-banner" role="alert">
      <div class="error-msg">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>
      <button type="button" class="retry-btn" @click="fetchTodos">ลองใหม่</button>
    </div>

    <!-- ฟอร์มเพิ่ม Todo -->
    <form class="add-box" @submit.prevent="addTodo">
      <label for="new-todo" class="input-label">Text :</label>
      <div class="input-group">
        <input
          id="new-todo"
          v-model="newTodo"
          type="text"
          placeholder="เพิ่มรายการใหม่ เช่น ทำการบ้าน, อ่านหนังสือ..."
          :disabled="isAdding"
          autocomplete="off"
        />
        <button
          type="submit"
          class="add-button"
          :disabled="!newTodo.trim() || isAdding"
        >
          <span v-if="isAdding">กำลังเพิ่ม...</span>
          <span v-else>+ Add</span>
        </button>
      </div>
    </form>

    <!-- กล่องสรุปสถานะงาน -->
    <div class="summary">
      <div
        class="summary-card completed"
        :class="{ active: filterType === 'completed' }"
        @click="filterType = filterType === 'completed' ? 'all' : 'completed'"
      >
        <span class="summary-label">จำนวนที่เสร็จ</span>
        <span class="summary-num">{{ completedCount }}</span>
      </div>

      <div
        class="summary-card incomplete"
        :class="{ active: filterType === 'active' }"
        @click="filterType = filterType === 'active' ? 'all' : 'active'"
      >
        <span class="summary-label">จำนวนที่ไม่เสร็จ</span>
        <span class="summary-num">{{ incompleteCount }}</span>
      </div>
    </div>

    <!-- แถบกรอง (Filter Tabs) -->
    <div class="filter-tabs">
      <button
        type="button"
        class="filter-tab"
        :class="{ selected: filterType === 'all' }"
        @click="filterType = 'all'"
      >
        ทั้งหมด ({{ todos.length }})
      </button>
      <button
        type="button"
        class="filter-tab"
        :class="{ selected: filterType === 'active' }"
        @click="filterType = 'active'"
      >
        ยังไม่เสร็จ ({{ incompleteCount }})
      </button>
      <button
        type="button"
        class="filter-tab"
        :class="{ selected: filterType === 'completed' }"
        @click="filterType = 'completed'"
      >
        เสร็จแล้ว ({{ completedCount }})
      </button>
    </div>

    <!-- สถานะกำลังโหลด -->
    <div v-if="loading" class="state-box loading-state">
      <div class="spinner"></div>
      <p>กำลังโหลดข้อมูลจาก Backend...</p>
    </div>

    <!-- รายการ Todo -->
    <ul v-else-if="filteredTodos.length > 0" class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.done }"
      >
        <TodoItem
          :todo="todo"
          :is-editing="editId === todo.id"
          :edit-text="editId === todo.id ? editText : todo.text"
          @start-edit="startEdit(todo)"
          @update:edit-text="editText = $event"
          @update-todo="updateTodo(todo)"
          @cancel-edit="cancelEdit"
          @delete-todo="deleteTodo"
          @toggle-done="toggleTodo"
        />
      </li>
    </ul>

    <!-- สถานะไม่มีรายการ -->
    <div v-else class="state-box empty-state">
      <span class="empty-icon">📝</span>
      <p v-if="filterType === 'all'">ยังไม่มีรายการ Todo ในระบบ</p>
      <p v-else-if="filterType === 'active'">ไม่มีรายการที่ค้างอยู่ เยี่ยมมาก! 🎉</p>
      <p v-else>ยังไม่มีรายการที่ทำเสร็จ</p>
      <small>เพิ่มงานใหม่ผ่านช่องพิมพ์ด้านบนได้ทันที</small>
    </div>
  </div>
</template>

<style scoped>
.todo-card {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 36px 40px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.total-badge {
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  background: #f1f5f9;
  border-radius: 999px;
}

.backend-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
}

.backend-status.online {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.backend-status.offline {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.reconnect-btn {
  margin-left: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #991b1b;
  background: #ffffff;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.reconnect-btn:hover {
  background: #fee2e2;
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 16px;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.retry-btn {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #b91c1c;
}

.add-box {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group input {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  font-size: 15px;
  color: #0f172a;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s ease;
}

.input-group input:focus {
  background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}

.add-button {
  padding: 0 28px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: #10b981;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 22px;
}

.summary-card {
  padding: 18px 20px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-card.completed {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.summary-card.completed:hover,
.summary-card.completed.active {
  background: #dcfce7;
  border-color: #86efac;
  transform: translateY(-2px);
}

.summary-card.incomplete {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.summary-card.incomplete:hover,
.summary-card.incomplete.active {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.summary-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.summary-num {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.summary-card.completed .summary-num {
  color: #15803d;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.filter-tab {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-tab:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.filter-tab.selected {
  background: #e2e8f0;
  color: #0f172a;
  font-weight: 700;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-item {
  padding: 16px 20px;
  background: #ffffff;
  border: 1.5px solid #edf2f7;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
  transition: all 0.2s ease;
}

.todo-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

.todo-item.completed {
  background: #f8fafc;
  border-color: #e2e8f0;
  opacity: 0.85;
}

.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #64748b;
}

.spinner {
  width: 36px;
  height: 36px;
  margin-bottom: 16px;
  border: 3px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.empty-state small {
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 600px) {
  .todo-card {
    padding: 24px 18px;
    border-radius: 18px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-group {
    flex-direction: column;
  }

  .add-button {
    padding: 12px;
  }

  .summary {
    gap: 10px;
  }
}
</style>