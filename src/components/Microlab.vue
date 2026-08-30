<script setup>
import { ref, computed } from 'vue'

const products = ref([
  {
    name: 'Keyboard',
    price: 500,
    qty: 2
  },
  {
    name: 'Mouse',
    price: 300,
    qty: 2
  }
])

const increase = (product) => {
  product.qty++
}

const decrease = (product) => {
  if (product.qty > 0) {
    product.qty--
  }
}

const grandTotal = computed(() => {
  return products.value.reduce((total, product) => {
    return total + product.price * product.qty
  }, 0)
})
</script>

<template>
  <div class="cart">
    <h2>Cart Summary</h2>

    <table>
      <thead>
        <tr>
          <th>product</th>
          <th>price</th>
          <th>quanlity</th>
          <th>total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in products" :key="product.name">
          <td>{{ product.name }}</td>
          <td>{{ product.price }}</td>

          <td>
            <button @click="decrease(product)">-</button>
            {{ product.qty }}
            <button @click="increase(product)">+</button>
          </td>

          <td>{{ product.price * product.qty }}</td>
        </tr>
      </tbody>
    </table>

    <h3>Total: {{ grandTotal }} บาท</h3>
  </div>
</template>

<style scoped>
.cart {
  padding: 20px;
}

table {
  border-spacing: 12px 8px;
}

button {
  margin: 0 5px;
  padding: 3px 8px;
  cursor: pointer;
}

h2 {
  margin-bottom: 10px;
}

h3 {
  margin-top: 10px;
}
</style>