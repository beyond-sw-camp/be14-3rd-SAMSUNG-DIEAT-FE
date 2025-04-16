<template>
    <button class="add-meal-button" @click="addMeal">식사 추가</button>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const addMeal = () => {
    router.push('/RegistMeal')
  }
  </script>
  
  <style scoped>
  .add-meal-button {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 10px;
    border: 2px solid black;
    background-color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-meal-button:hover {
    background-color: #f2f2f2;
  }
  </style>
  