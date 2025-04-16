<template>
    <div class="filter-bar">
      <input
        type="text"
        v-model="filters.keyword"
        placeholder="식단 이름을 검색하세요"
      />
  
      <div class="range-inputs">
        <label>칼로리</label>
        <input type="number" v-model.number="filters.minCalories" placeholder="최소" />
        <input type="number" v-model.number="filters.maxCalories" placeholder="최대" />
      </div>
  
      <div class="range-inputs">
        <label>단백질</label>
        <input type="number" v-model.number="filters.minProtein" placeholder="최소" />
        <input type="number" v-model.number="filters.maxProtein" placeholder="최대" />
      </div>
  
      <button @click="emitFilter">검색</button>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  const emit = defineEmits(['filter'])
  
  const filters = reactive({
    keyword: '',
    minCalories: null,
    maxCalories: null,
    minProtein: null,
    maxProtein: null
  })
  
  const emitFilter = () => {
    emit('filter', { ...filters })
  }
  </script>
  
  <style scoped>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  input[type="text"],
  input[type="number"] {
    padding: 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .range-inputs {
    display: flex;
    flex-direction: column;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  