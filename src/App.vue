<script setup>
  import {ref} from 'vue'
  const subTitle = "Hello World"
  const imgUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLiHDiv0FanWEQL1E9LaFXf5whweprcBA0ADqEBs8eGQ&s=10"
  const title = ref('Vue.js Course')
  const owner = ref('HTET')
  const remaining = ref(5)
  const isLocked = ref(false)
  import hello from './components/Hello.vue'
  import Todo from './components/Todo.vue'
  import TodoForm from './components/TodoForm.vue'
  import TodoComputed from './components/TodoComputed.vue'
  import Microlab from './components/Microlab.vue'
  import Header from './components/Header.vue'
  import TodoList from './components/TodoList.vue'
  
</script>

<template>
  <div class="page">

    <header class="top-header">
      <img
        alt="Vue logo"
        class="logo"
        src="./assets/logo.svg"
        width="125"
        height="125"
      />
      
    </header>

    <section class="card">
      <Hello></Hello>
    </section>

    <section class="todo-grid">
      <div class="card">
        <Todo></Todo>
      </div>

      <div class="card">
        <TodoComputed></TodoComputed>
        
      </div>

      <div class="card">
        <TodoForm />
      </div>
    </section>

    <main class="main-grid">

      <section class="card">
        <h2>Task Summary</h2>

        <p>Title: {{ title }}</p>
        <p>Owner: {{ owner }}</p>
        <p>Remaining: {{ remaining }}</p>
        <p>Locked: {{ isLocked }}</p>

        <button
          :disabled="isLocked"
          :aria-disabled="isLocked"
        >
          add
        </button>
      </section>

      <section class="card image-card">
        <img :src="imgUrl" />
      </section>

    </main>

    <section class="card">
      <Microlab></Microlab>
      <Header></Header>
      <TodoList></TodoList>
    </section>
  </div>
</template>

<style scoped>
/* =========================
   Full Screen Background
========================= */
:global(*) {
  box-sizing: border-box;
}

:global(html),
:global(body),
:global(#app) {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

:global(body) {
  min-height: 100vh;
  background-color: #eaf6ff;
  font-family: Arial, Helvetica, sans-serif;
}

/* =========================
   Main Page
========================= */
.page {
  width: 100%;
  min-height: 100vh;

  padding: 30px 40px;

  background-color: #eaf6ff;
  color: #334155;
}

/* =========================
   Vue Header
========================= */
.top-header {
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 25px;
  margin-bottom: 25px;

  background-color: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 16px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.logo {
  display: block;
  width: 110px;
  height: 110px;
  margin: 0;
}

/* =========================
   All Cards
========================= */
.card {
  width: 100%;

  padding: 25px;
  margin-bottom: 25px;

  background-color: #ffffff;

  border: 1px solid #dbeafe;
  border-radius: 14px;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* =========================
   Todo 3 Columns
========================= */
.todo-grid {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 25px;
  margin-bottom: 25px;
}

.todo-grid .card {
  margin-bottom: 0;
  min-height: 200px;
}

/* =========================
   Task Summary + Image
========================= */
.main-grid {
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 25px;

  margin: 0 0 25px 0;
  padding: 0;

  background: transparent;
}

.main-grid .card {
  margin-bottom: 0;
  min-height: 280px;
}

/* =========================
   Task Summary
========================= */
main h2 {
  margin-top: 0;
  margin-bottom: 20px;

  color: #1e293b;
  font-size: 28px;
}

main p {
  margin: 12px 0;

  color: #64748b;
  font-size: 16px;
}

/* =========================
   Button
========================= */
button {
  padding: 10px 20px;

  border: none;
  border-radius: 8px;

  background-color: #42b883;
  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;
}

button:hover {
  background-color: #369f72;
  transform: translateY(-1px);
}

button:disabled {
  background-color: #cbd5e1;
  color: #64748b;

  cursor: not-allowed;
  transform: none;
}

/* =========================
   Image
========================= */
.image-card {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #f8fcff;
}

.image-card img {
  width: 100%;
  max-width: 500px;
  max-height: 280px;

  object-fit: contain;

  margin: 0;

  border-radius: 12px;
}

img {
  max-width: 100%;
  height: auto;
}

/* =========================
   Microlab / Header / TodoList
========================= */
.page > .card:last-child {
  width: 100%;

  padding: 30px;

  background-color: #ffffff;

  border-top: 4px solid #42b883;
}

.page > .card:last-child > * {
  margin-bottom: 25px;
}

.page > .card:last-child > *:last-child {
  margin-bottom: 0;
}

/* =========================
   Headings
========================= */
h1,
h2,
h3 {
  color: #1e293b;
}

/* =========================
   Tablet
========================= */
@media (max-width: 1000px) {
  .page {
    padding: 25px;
  }

  .todo-grid {
    grid-template-columns: 1fr 1fr;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

/* =========================
   Mobile
========================= */
@media (max-width: 700px) {
  .page {
    padding: 15px;
  }

  .top-header {
    padding: 18px;
  }

  .logo {
    width: 90px;
    height: 90px;
  }

  .todo-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .main-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .card {
    padding: 18px;
    margin-bottom: 15px;
  }

  .page > .card:last-child {
    padding: 18px;
  }
}
</style>