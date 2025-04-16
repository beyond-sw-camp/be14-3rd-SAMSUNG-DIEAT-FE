<template>
    <div class="pagination">
      <button @click="prev" :disabled="currentPage === 1">이전</button>
      <span v-for="p in totalPages" :key="p" @click="$emit('change', p)" :class="{ active: p === currentPage }">{{ p }}</span>
      <button @click="next" :disabled="currentPage === totalPages">다음</button>
    </div>
  </template>
  
  <script setup>
  defineProps(['currentPage', 'totalPages']);
  const emit = defineEmits(['change']);
  
  const prev = () => {
    if (props.currentPage > 1) emit('change', props.currentPage - 1);
  };
  const next = () => {
    if (props.currentPage < props.totalPages) emit('change', props.currentPage + 1);
  };
  </script>
  
  <style scoped>
  .pagination span {
    margin: 0 5px;
    cursor: pointer;
  }
  .pagination .active {
    font-weight: bold;
    color: green;
  }
  </style>
  