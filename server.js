import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'todos.json')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ข้อมูลเริ่มต้นจำลอง เมื่อยังไม่มีข้อมูลในระบบ
const defaultTodos = [
  { id: 1, text: 'เรียนรู้ Vue 3 Composition API', done: true },
  { id: 2, text: 'สร้าง Todo List App', done: true },
  { id: 3, text: 'เชื่อมต่อกับ Backend Express API', done: false }
]

// อ่านข้อมูล Todo จากไฟล์ (ถ้ามี) หรือใช้ค่าเริ่มต้น
function loadTodos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('ไม่สามารถอ่านไฟล์ todos.json ได้:', err.message)
  }
  return [...defaultTodos]
}

let todos = loadTodos()
let nextId = todos.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1

// บันทึกข้อมูลลงไฟล์ todos.json (ปลอดภัยสำหรับ Serverless / Read-only environments เช่น Vercel)
function saveTodos() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8')
  } catch (err) {
    // บน Serverless หรือ Vercel อาจเป็น Read-only filesystem ให้เก็บใน memory ต่อไป
    console.warn('ไม่สามารถเขียนไฟล์ลงดิสก์ได้ (ใช้ memory fallback):', err.message)
  }
}

// 0. Health check endpoint (สำคัญมากสำหรับการตรวจการบ้านและ deploy)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// สร้าง Router สำหรับจัดการ Todo เพื่อให้รองรับทั้ง /todos และ /api/todos
const todoRouter = express.Router()

// 1. ดึงรายการ Todo ทั้งหมด (GET)
todoRouter.get('/', (req, res) => {
  res.json(todos)
})

// 2. เพิ่มรายการ Todo ใหม่ (POST)
todoRouter.post('/', (req, res) => {
  const text = req.body.text?.trim()
  if (!text) {
    return res.status(400).json({ message: 'กรุณาระบุข้อความ Todo' })
  }

  const todo = {
    id: nextId++,
    text,
    done: Boolean(req.body.done)
  }

  todos.push(todo)
  saveTodos()
  res.status(201).json(todo)
})

// ฟังก์ชันอัปเดต Todo (ใช้ร่วมกันสำหรับ PATCH และ PUT)
const handleUpdateTodo = (req, res) => {
  const todoId = Number(req.params.id)
  const todo = todos.find(item => item.id === todoId)
  if (!todo) {
    return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการแก้ไข' })
  }

  if (typeof req.body.text === 'string') {
    const trimmed = req.body.text.trim()
    if (!trimmed) {
      return res.status(400).json({ message: 'ข้อความต้องไม่เว้นว่าง' })
    }
    todo.text = trimmed
  }

  if (typeof req.body.done === 'boolean') {
    todo.done = req.body.done
  }

  saveTodos()
  res.json(todo)
}

// 3. อัปเดตรายการ Todo (PATCH / PUT)
todoRouter.patch('/:id', handleUpdateTodo)
todoRouter.put('/:id', handleUpdateTodo)

// 4. ลบรายการ Todo (DELETE)
todoRouter.delete('/:id', (req, res) => {
  const todoId = Number(req.params.id)
  const index = todos.findIndex(item => item.id === todoId)
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ' })
  }

  todos.splice(index, 1)
  saveTodos()
  res.status(204).end()
})

// เชื่อมต่อ Router กับ path ทั้งสองแบบ
app.use('/todos', todoRouter)
app.use('/api/todos', todoRouter)

// Root Endpoint สำหรับทดสอบสถานะ Backend
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend Express API พร้อมใช้งานแล้ว',
    endpoints: {
      health: 'GET /api/health',
      getTodos: 'GET /todos หรือ GET /api/todos',
      createTodo: 'POST /todos หรือ POST /api/todos',
      updateTodo: 'PATCH /todos/:id หรือ PATCH /api/todos/:id',
      deleteTodo: 'DELETE /todos/:id หรือ DELETE /api/todos/:id'
    }
  })
})

// ถ้าไม่ได้รันบน Vercel ให้เปิด HTTP listener ตามปกติ
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend พร้อมใช้งานที่ http://localhost:${PORT}`)
  })
}

export default app